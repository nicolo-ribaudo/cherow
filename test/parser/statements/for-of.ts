import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/cherow';

describe('Statements - For of', () => {
  const inValids: Array<[string, Context]> = [
    ['for (let of x) y', Context.OptionsDisableWebCompat],
    //['for (var i, j of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    //['for (var i, j = 1 of {}) {}', Context.OptionsDisableWebCompat],
    //['for (var i, j = void 0 of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    //['for (let i, j of {}) {}', Context.OptionsDisableWebCompat],
    //['for (let i, j of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    // ['for (let i, j = 1 of {}) {}', Context.OptionsDisableWebCompat],
    //    ['for (let i, j = void 0 of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    ['for (const i, j of {}) {}', Context.OptionsDisableWebCompat],
    ['for (const i, j of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    ['for (const i, j = 1 of {}) {}', Context.OptionsDisableWebCompat],
    ['for (const i, j = void 0 of [1, 2, 3]) {}', Context.OptionsDisableWebCompat],
    ['for(const x of [], []) {}', Context.OptionsDisableWebCompat],
    ['for(x of [], []) {}', Context.OptionsDisableWebCompat],
    ['for(var x of [], []) {}', Context.OptionsDisableWebCompat],
    ['for(let x of [], []) {}', Context.OptionsDisableWebCompat]
  ];

  const programs = [
    'for({a=0} of b);',
    'for (let of of ([0])) { }',
    'for (let of of [0]) { }',
    'for (let of; false; ) { }',
    'for (let of, bar; false; ) { }',
    'for (let of = 10; false; ) { }',
    'for (j of x) { foo = j }',
    'for (j of x) { [foo] = [j] }',
    'for (j of x) { var foo = j }',
    'for (j of x) { var [foo] = [j] }',
    'for (j of x) { var [foo] = [j] }',
    'for (j of x) { const [foo] = [j] }',
    'for (var i, j of {}) {}',
    'for (j of x) { function foo() {return j} }',
    'for ({j} of x) { foo = j }',
    'for ({j} of x) { let foo = j }',
    'for ({j} of x) { function foo() {return j} }',
    'for (var {j} of x) { foo = j }',
    'function* g() { for(x of yield) {} }',
    'function* g() { for(var x of yield) {} }',
    'function* g() { for(let x of yield) {} }',
    'function* g() { for(const x of yield) {} }',
    // AssignmentExpression should be validated statically:
    'for(x of { y = 23 }) {}',
    'for(var x of { y = 23 }) {}',
    //"for(let x of { y = 23 }) {}",
    'for(const x of { y = 23 }) {}',
    'for (var {j} of x) { let foo = j }',
    'for (let j of x) { const [foo] = [j] }',
    'for (let j of x) { [foo] = [j] }',
    'for (let {j} of x) { [foo] = [j] }',
    'for ( let x of y ) {}',
    `var x, y;
    for ({x, y} of [{x: 1, y: 2}]) {}`,
    `var x, y;
    for ([x, y] of [[1, 2]]) {
      console.log(x, y);
    }`,
    `function foo () {
      for ( let x of y ) {
    bar( function () {
      call( x ); // call expression
  });
    if ( x > 10 ) return;
    }
  }`,
    'for (let {j} of x) { foo = j }',
    `for ( var i = 0, list = items; i < list.length; i += 1 ) {
    var item = list[i];
      if ( item.foo ) { continue; }
  }`,
    `for ( x of y ) {}`,
    `for ( let member of [ 'a', 'b', 'c' ] ) {
    setTimeout( function () {
    doSomething( member );
    });
   }`,
    `for ( let member of array ) { doSomething( member ); }`,
    'for (const {j} of x) { const [foo] = [j] }',
    'for (const {j} of x) { var [foo] = [j] }',
    `for ([] of [{ next: function() {return { done: true }; },return: function() {return {}; }}]) {}`,
    `function* g() { for(x of yield) {} }`,
    `function* g() { for(var x of yield) {} }`,
    `function* g() { for(const x of yield) {} }`,
    `for(var a of b);`,
    `for(let [a] of b);`,
    `for(let of of b);`,
    `for(const a of b);`,
    `for({a=0} of b);`,
    `for([{a=0}] of b);`,
    `for (var x of set) {}`,
    `for (x.y of [23]) {}
    for (x.y of [23]) {}
    for (x.y of [23]) {}
    for (x.y of [23]) {}`,
    `for ( let[x] of [[34]] ) {}`,
    `for (var { x, } of [{ x: 23 }]) {}`,
    `for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}`,
    `for (var [...{ length }] of [[1, 2, 3]]) {}`
  ];

  for (const arg of programs) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Empty);
      });
    });
  }
  // valid tests
  const valids: Array<[string, Context, any]> = [
    [
      'for (var a of b);',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let a of b);',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const a of b);',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (a of b);',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var a of b);',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ]
  ];

  pass('Statements - For of (pass)', valids);

  fail('Statements - For (fail)', inValids);
});
