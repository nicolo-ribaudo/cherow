import * as ESTree from '../estree';
import { Chars } from '../chars';
import { Parser, Location } from '../types';
import { Token, tokenDesc } from '../token';
import { Errors, report } from '../errors';
import { isValidIdentifierPart, isValidIdentifierStart } from '../unicode';
import { parseLiteral, parseAssignmentExpression, parseExpression } from './expressions';
import {
    Context,
    expect,
    getLocation,
    consume,
    hasNext,
    nextChar,
    advance,
    consumeOpt,
    finishNode,
    storeRaw,
    nextTokenIsFuncKeywordOnSameLine,
    nextToken,
    isQualifiedJSXName,
    fromCodePoint
} from '../utilities';

// JSX Specification
// https://facebook.github.io/jsx/

/**
 * Parses JSX element or JSX fragment
 *
 * @param parser Parser object
 * @param context Context masks
 * @param inExpression True if we are parsing in expression context
 */
export function parseJSXRootElement(
    parser: Parser,
    context: Context,
    inExpression: boolean
): any {
    const pos = getLocation(parser);
    let children: ESTree.JSXElement[] = [];
    let closingElement = null;
    let selfClosing = false;
    let openingElement: any;
    expect(parser, context, Token.LessThan);
    const isFragment = parser.token === Token.GreaterThan;
    if (isFragment) {
        openingElement = parseJSXOpeningFragment(parser, context, pos);
    } else {
        const name = parseJSXElementName(parser, context);
        const attributes = parseJSXAttributes(parser, context);
        selfClosing = consume(parser, context, Token.Divide);
        openingElement = parseJSXOpeningElement(parser, context, name, attributes, selfClosing, pos, inExpression);
    }

    if (isFragment) {
        openingElement;
        return parseJSXFragment(parser, context, openingElement, pos);
    } else if (!selfClosing) {
        children = parseJSXChildren(parser, context);
        closingElement = parseJSXClosingElement(parser, context, inExpression);
        const open = isQualifiedJSXName(openingElement.name);
        const close = isQualifiedJSXName(closingElement.name);
        if (open !== close) report(parser, Errors.ExpectedJSXClosingTag, close);
    }
    return finishNode(context, parser, pos, {
        type: 'JSXElement',
        children,
        openingElement,
        closingElement,
    });
}

/**
 * Parses JSX opening element
 *
 * @param parser Parser object
 * @param context Context masks
 * @param name Element name
 * @param attributes Element attributes
 * @param selfClosing True if this is a selfclosing JSX Element
 * @param pos Line / Column tracking
 * @param inExpression True if we are parsing in expression context
 */
export function parseJSXOpeningElement(
    parser: Parser,
    context: Context,
    name: string,
    attributes: any,
    selfClosing: boolean,
    pos: Location,
    inExpression: boolean
): any {
    if (selfClosing && inExpression) expect(parser, context, Token.GreaterThan);
    else nextJSXToken(parser, context);
    return finishNode(context, parser, pos, {
        type: 'JSXOpeningElement',
        name,
        attributes,
        selfClosing
    });
}

/**
 * Parse JSX fragment
 *
 * @param parser Parser object
 * @param context Context masks
 * @param openingElement Opening fragment
 * @param pos Line / Column location
 */
function parseJSXFragment(parser: Parser, context: Context, openingElement: any, pos: Location): ESTree.JSXOpeningFragment {
    const children = parseJSXChildren(parser, context);
    const closingElement = parseJSXClosingFragment(parser, context);
    return finishNode(context, parser, pos, {
        type: 'JSXFragment',
        children,
        openingElement,
        closingElement,
    });
}

/**
 * Parse JSX opening fragment
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Line / Column location
 */
function parseJSXOpeningFragment(parser: Parser, context: Context, pos: Location): ESTree.JSXOpeningFragment {
    nextJSXToken(parser, context);
    return finishNode(context, parser, pos, {
        type: 'JSXOpeningFragment'
    });
}

/**
 * Prime the scanner and advance to the next JSX token in the stream
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function nextJSXToken(parser: Parser, context: Context): Token {
    return parser.token = scanJSXToken(parser, context);
}

/**
 * Mini scanner
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanJSXToken(parser: Parser, context: Context): Token {

    parser.lastIndex = parser.startIndex = parser.index;

    const char = nextChar(parser);
    if (char === Chars.LessThan) {
        advance(parser);
        return consumeOpt(parser, Chars.Slash) ? Token.JSXClose : Token.LessThan;
    } else if (char === Chars.LeftBrace) {
        advance(parser);
        return Token.LeftBrace;
    }

    while (hasNext(parser)) {
        const next = nextChar(parser);
        if (next === Chars.LeftBrace || next === Chars.LessThan) break;
        advance(parser);
    }
    return Token.JSXText;
}

/**
 * Parses JSX children
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXChildren(parser: Parser, context: Context): any {
    const children: any = [];
    while (parser.token !== Token.JSXClose) {
        children.push(parseJSXChild(parser, context));
    }

    return children;
}

/**
 * Parses JSX Text
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXText(parser: Parser, context: Context): ESTree.JSXText {
    const pos = getLocation(parser);
    const value = parser.source.slice(parser.startIndex, parser.index);
    parser.token = scanJSXToken(parser, context);
    const node: any = finishNode(context, parser, pos, {
        type: 'JSXText',
        value
    });

    if (context & Context.OptionsRaw) node.raw = value;

    return node;
}

/**
 * Parses JSX Child
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXChild(parser: Parser, context: Context) {
    switch (parser.token) {
        case Token.Identifier:
        case Token.JSXText:
            return parseJSXText(parser, context);
        case Token.LeftBrace:
            return parseJSXExpression(parser, context, false);
        case Token.LessThan:
            return parseJSXRootElement(parser, context, false);
    }
}

/**
 * Parses JSX attributes
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXAttributes(parser: Parser, context: Context) {
    const attributes: ESTree.JSXAttribute[] = [];
    while (hasNext(parser)) {
        if (parser.token === Token.Divide || parser.token === Token.GreaterThan) break;
        attributes.push(parseJSXAttribute(parser, context));
    }
    return attributes;
}

/**
 * Parses JSX spread attribute
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXSpreadAttribute(parser: Parser, context: Context): ESTree.JSXSpreadAttribute {
    const pos = getLocation(parser);
    expect(parser, context, Token.LeftBrace);
    expect(parser, context, Token.Ellipsis);
    const expression = parseExpression(parser, context);

    expect(parser, context, Token.RightBrace);

    return finishNode(context, parser, pos, {
        type: 'JSXSpreadAttribute',
        argument: expression
    });
}

/**
 * Parses JSX namespace name
 *
 * @param parser Parser object
 * @param context Context masks
 * @param namespace Identifier
 * @param pos Line / Column location
 */

export function parseJSXNamespacedName(
    parser: Parser,
    context: Context,
    namespace: ESTree.JSXIdentifier | ESTree.JSXMemberExpression,
    pos: Location
): ESTree.JSXNamespacedName {
    expect(parser, context, Token.Colon);
    const name = parseJSXIdentifier(parser, context);
    return finishNode(context, parser, pos, {
        type: 'JSXNamespacedName',
        namespace,
        name
    });
}

/**
 * Parses JSX attribute name
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXAttributeName(parser: Parser, context: Context): ESTree.JSXIdentifier | ESTree.JSXNamespacedName {
    const pos = getLocation(parser);
    const identifier = parseJSXIdentifier(parser, context);
    return parser.token === Token.Colon ?
        parseJSXNamespacedName(parser, context, identifier, pos) :
        identifier;
}

/**
 * Parses JSX Attribute
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXAttribute(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    if (parser.token === Token.LeftBrace) return parseJSXSpreadAttribute(parser, context);
    scanJSXIdentifier(parser, context);
    const attrName = parseJSXAttributeName(parser, context);
    let value: any = null;
    if (parser.token === Token.Assign) {
        switch (scanJSXAttributeValue(parser, context)) {
            case Token.StringLiteral:
                value = parseLiteral(parser, context);
                break;
            case Token.LeftBrace:
                value = parseJSXExpressionAttribute(parser, context, true);
                break;
            default:
                value = parseJSXRootElement(parser, context, true);

        }
    }
    return finishNode(context, parser, pos, {
        type: 'JSXAttribute',
        value,
        name: attrName
    });
}

/**
 * Parses JSX Attribute value
 *
 * @param parser Parser object
 * @param context Context masks
 */

function scanJSXAttributeValue(parser: Parser, context: Context): any {
    parser.lastIndex = parser.index;
    const ch = nextChar(parser);
    switch (ch) {
        case Chars.DoubleQuote:
        case Chars.SingleQuote:
            return scanJSXString(parser, context, ch);
        default:
            return parser.token = nextToken(parser, context);
    }
}

/**
 * Parses JSX String
 *
 * @param parser Parser object
 * @param context Context masks
 * @param quote Code point
 */
function scanJSXString(parser: Parser, context: Context, quote: number): Token {

    const rawStart = parser.index;
    advance(parser);

    let ret = '';
    const start = parser.index;
    let ch = nextChar(parser);
    while (ch !== quote) {
        ret += fromCodePoint(ch);
        advance(parser);
        ch = nextChar(parser);
        if (!hasNext(parser)) report(parser, Errors.UnterminatedString);
    }

    advance(parser); // skip the quote

    // raw
    if (context & Context.OptionsRaw) storeRaw(parser, rawStart);

    parser.tokenValue = ret;

    return Token.StringLiteral;
}

/**
 * Parses JJSX Empty Expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXEmptyExpression(parser: Parser, context: Context): ESTree.JSXEmptyExpression {
    const pos = getLocation(parser);
    return finishNode(context, parser, pos, {
        type: 'JSXEmptyExpression'
    });
}

/**
 * Parses JSX Spread child
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseJSXSpreadChild(parser: Parser, context: Context): ESTree.JSXSpreadChild {
    const pos = getLocation(parser);
    expect(parser, context, Token.Ellipsis);
    const expression = parseExpression(parser, context);
    expect(parser, context, Token.RightBrace);
    return finishNode(context, parser, pos, {
        type: 'JSXSpreadChild',
        expression
    });
}

/**
 * Parses JSX Expression attribute
 *
 * @param parser Parser object
 * @param context Context masks
 * @param inExpression True if we are parsing in expression context
 */

export function parseJSXExpressionAttribute(parser: Parser, context: Context, inExpression: boolean): any {
    const pos = getLocation(parser);
    expect(parser, context, Token.LeftBrace);
    if (parser.token === Token.RightBrace) report(parser, Errors.Unexpected); //
    if (parser.token === Token.Ellipsis) return parseJSXSpreadChild(parser, context);
    const expression = parseAssignmentExpression(parser, context);
    if (inExpression) expect(parser, context, Token.RightBrace);
    else nextJSXToken(parser, context);

    return finishNode(context, parser, pos, {
        type: 'JSXExpressionContainer',
        expression
    });
}

/**
 * Parses JSX Expression
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Line / Column location
 * @param inExpression True if we are parsing in expression context
 */

export function parseJSXExpression(parser: Parser, context: Context, inExpression: boolean): ESTree.JSXExpressionContainer | ESTree.JSXSpreadChild {
    const pos = getLocation(parser);
    expect(parser, context, Token.LeftBrace);
    if (parser.token === Token.Ellipsis) return parseJSXSpreadChild(parser, context);
    const expression = parser.token === Token.RightBrace ?
        parseJSXEmptyExpression(parser, context) :
        parseAssignmentExpression(parser, context);

    if (inExpression) expect(parser, context, Token.RightBrace);
    else nextJSXToken(parser, context);

    return finishNode(context, parser, pos, {
        type: 'JSXExpressionContainer',
        expression
    });
}

/**
 * Parses JSX Closing fragment
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXClosingFragment(parser: Parser, context: Context) {
    const pos = getLocation(parser);
    expect(parser, context, Token.JSXClose);
    expect(parser, context, Token.GreaterThan);
    return finishNode(context, parser, pos, {
        type: 'JSXClosingFragment'
    });
}

/**
 * Parses JSX Closing Element
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Line / Column location
 * @param inExpression True if we are parsing in expression context
 */
export function parseJSXClosingElement(parser: Parser, context: Context, inExpression: boolean): ESTree.JSXClosingElement {
    const pos = getLocation(parser);
    expect(parser, context, Token.JSXClose);
    const name = parseJSXElementName(parser, context);
    if (inExpression) expect(parser, context, Token.GreaterThan);
    else nextJSXToken(parser, context);
    return finishNode(context, parser, pos, {
        type: 'JSXClosingElement',
        name
    });
}

/**
 * Parses JSX Identifier
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXIdentifier(parser: Parser, context: Context): ESTree.JSXIdentifier {
    const { token, tokenValue: name, tokenRaw: raw } = parser;
    
    if (!(token & (Token.IsIdentifier | Token.Keyword))) report(parser, Errors.UnexpectedToken, tokenDesc(parser.token));

    const pos = getLocation(parser);
    nextToken(parser, context);
    const node: any = finishNode(context, parser, pos, {
        type: 'JSXIdentifier',
        name
    });
    if (context & Context.OptionsRawidentifiers) node.raw = raw;
    return node;
}

/**
 * Parses JSX Member expression
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Line / Column location
 * @param inExpression True if we are parsing in expression context
 */

export function parseJSXMemberExpression(parser: Parser, context: Context, expr: any, pos: Location): ESTree.JSXMemberExpression {
    return finishNode(context, parser, pos, {
        type: 'JSXMemberExpression',
        object: expr,
        property: parseJSXIdentifier(parser, context)
    });
}

/**
 * Parses JSX Element name
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseJSXElementName(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    scanJSXIdentifier(parser, context);
    let elementName: ESTree.JSXIdentifier | ESTree.JSXMemberExpression = parseJSXIdentifier(parser, context);
    if (parser.token === Token.Colon) return parseJSXNamespacedName(parser, context, elementName, pos);
    while (consume(parser, context, Token.Period)) {
        elementName = parseJSXMemberExpression(parser, context, elementName, pos);
    }
    return elementName;
}

/**
 * Scans JSX Identifier
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanJSXIdentifier(parser: Parser, context: Context): Token {
    const { token, index: start } = parser;
    if (token & (Token.IsIdentifier | Token.Keyword)) {
        while (hasNext(parser)) {
            const ch = nextChar(parser);
            if (ch === Chars.Hyphen || (isValidIdentifierPart(ch))) {
                advance(parser);
            } else {
                break;
            }
        }
        parser.tokenValue += parser.source.substr(start, parser.index - start);
    }
    return parser.token;
}