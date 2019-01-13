import * as ESTree from './estree';
import { Context, OnComment, OnToken, ParserState, Type, Origin } from './common';
import { ScopeState } from './scope';
export declare const enum LabelledState {
    None = 0,
    AllowAsLabelled = 1,
    Disallow = 2
}
export declare const enum ObjectState {
    None = 0,
    Method = 1,
    Computed = 2,
    Shorthand = 4,
    Generator = 8,
    Async = 16,
    Static = 32,
    Constructor = 64,
    Getter = 128,
    Setter = 256,
    GetSet = 384
}
export declare function create(source: string, onComment: OnComment | void, onToken: OnToken | void): ParserState;
export declare function parseTopLevel(state: ParserState, context: Context, scope: ScopeState): ESTree.Statement[];
export declare function parseDirective(state: ParserState, context: Context, scope: ScopeState): any;
export declare function parseImportDeclaration(state: ParserState, context: Context, scope: ScopeState): any;
export declare function parseBlockStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.BlockStatement;
export declare function parseEmptyStatement(state: ParserState, context: Context): ESTree.EmptyStatement;
export declare function parseThrowStatement(state: ParserState, context: Context): ESTree.ThrowStatement;
export declare function parseIfStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.IfStatement;
export declare function parseReturnStatement(state: ParserState, context: Context): ESTree.ReturnStatement;
export declare function parseWhileStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.WhileStatement;
export declare function parseContinueStatement(state: ParserState, context: Context): ESTree.ContinueStatement;
export declare function parseBreakStatement(state: ParserState, context: Context): ESTree.BreakStatement;
export declare function parseWithStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.WithStatement;
export declare function parseDebuggerStatement(state: ParserState, context: Context): ESTree.DebuggerStatement;
export declare function parseTryStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.TryStatement;
export declare function parseCatchBlock(state: ParserState, context: Context, scope: ScopeState): ESTree.CatchClause;
export declare function parseDoWhileStatement(state: ParserState, context: Context, scope: ScopeState): any;
export declare function parseCaseOrDefaultClauses(state: ParserState, context: Context, test: ESTree.Expression | null, scope: ScopeState): ESTree.SwitchCase;
export declare function parseExpressionOrLabelledStatement(state: ParserState, context: Context, scope: ScopeState, label: LabelledState): any;
export declare function parseBindingIdentifierOrPattern(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, verifyDuplicates: boolean): ESTree.Pattern;
export declare function parseBindingIdentifier(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, checkForDuplicates: boolean): ESTree.Identifier;
export declare function parseAssignmentRestElement(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, verifyDuplicates: boolean): any;
export declare function parseArrayAssignmentPattern(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, verifyDuplicates: boolean): ESTree.ArrayPattern;
export declare function parserObjectAssignmentPattern(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, verifyDuplicates: boolean): ESTree.ObjectPattern;
export declare function parseAssignmentPattern(state: ParserState, context: Context, left: ESTree.Pattern): any;
export declare function parseBindingInitializer(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin, verifyDuplicates: boolean): ESTree.Identifier | ESTree.ObjectPattern | ESTree.ArrayPattern | ESTree.MemberExpression | ESTree.AssignmentPattern;
export declare function parseComputedPropertyName(state: ParserState, context: Context): ESTree.Expression;
export declare function parseFunctionDeclaration(state: ParserState, context: Context, scope: ScopeState, isFuncDel: boolean, isAsync: boolean): {
    type: string;
    params: any;
    body: ESTree.BlockStatement;
    async: boolean;
    generator: boolean;
    id: ESTree.Identifier | null;
};
export declare function parseHoistableFunctionDeclaration(state: ParserState, context: Context, scope: ScopeState, isNotDefault: boolean, isAsync: boolean): {
    type: string;
    params: any;
    body: ESTree.BlockStatement;
    async: boolean;
    generator: boolean;
    id: ESTree.Identifier | null;
};
export declare function parseFormalParameters(state: ParserState, context: Context, scope: ScopeState, origin: Origin): any;
export declare function parseRestElement(state: ParserState, context: Context, scope: ScopeState, type: Type, origin: Origin): any;
export declare function parseFunctionBody(state: ParserState, context: Context, scope: ScopeState, firstRestricted: string | undefined, origin: Origin): ESTree.BlockStatement;
export declare function parseVariableStatement(state: ParserState, context: Context, type: Type, origin: Origin, scope: ScopeState): ESTree.VariableDeclaration;
export declare function parseLexicalDeclaration(state: ParserState, context: Context, type: Type, origin: Origin, scope: ScopeState): ESTree.VariableDeclaration;
export declare function parseVariableDeclarationList(state: ParserState, context: Context, type: Type, origin: Origin, checkForDuplicates: boolean, scope: ScopeState): any;
export declare function parseExpression(state: ParserState, context: Context): any;
export declare function parseSequenceExpression(state: ParserState, context: Context, left: ESTree.Expression): ESTree.SequenceExpression;
export declare function parseAssignmentExpression(state: ParserState, context: Context): any;
export declare function parseLeftHandSideExpression(state: ParserState, context: Context): any;
export declare function parseMetaProperty(state: ParserState, context: Context, id: ESTree.Identifier): any;
export declare function parsePrimaryExpression(state: ParserState, context: Context): any;
export declare function parseArrayExpression(state: ParserState, context: Context): any;
export declare function parseGroupExpression(state: ParserState, context: Context): any;
export declare function parseClassBodyAndElementList(state: ParserState, context: Context, origin: Origin): ESTree.ClassBody;
export declare function parseLiteral(state: ParserState, context: Context): ESTree.Literal;
export declare function parseIdentifier(state: ParserState, context: Context): ESTree.Identifier;
export declare function parseBigIntLiteral(state: ParserState, context: Context): ESTree.BigIntLiteral;
//# sourceMappingURL=state.d.ts.map