import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import { parseSource } from '../../../src/cherow';
import * as t from 'assert';

describe('Expressions - Exponentiation', () => {
  fail('Expressions - Exponentiation', [
    ['(async function f() { (await x ** y) }', Context.Empty],
    ['(-x ** 2)', Context.Empty],
    ['(+x ** 2)', Context.Empty],
    ['(~3 ** 2)', Context.Empty],
    ['(typeof 3 ** 2)', Context.Empty],
    ['(delete 3 ** 2)', Context.Empty],
    ['(!3 ** 2)', Context.Empty],
    ['-x ** 2;', Context.Empty],
    ['+x ** 2;', Context.Empty],
    ['delete 3 ** 2;', Context.Empty],
    ['!3 ** 2;', Context.Empty],
    ['typeof 3 ** 2;', Context.Empty],
    ['~3 ** 2;', Context.Empty],
    ['delete O.p ** 10', Context.Empty],
    ['delete x ** 10', Context.Empty],
    ['~O.p ** 10', Context.Empty],
    ['~x ** 10', Context.Empty],
    ['!O.p ** 10', Context.Empty],
    ['!x ** 10', Context.Empty],
    ['+O.p ** 10', Context.Empty],
    ['+x ** 10', Context.Empty],
    ['-O.p ** 10', Context.Empty],
    ['-x ** 10', Context.Empty],
    ['typeof O.p ** 10', Context.Empty],
    ['typeof x ** 10', Context.Empty],
    ['void ** 10', Context.Empty],
    ['void O.p ** 10', Context.Empty],
    ['void x ** 10', Context.Empty],
    ['++delete O.p ** 10', Context.Empty],
    ['--delete O.p ** 10', Context.Empty],
    ['++~O.p ** 10', Context.Empty],
    ['++~x ** 10', Context.Empty],
    ['--!O.p ** 10', Context.Empty],
    ['--!x ** 10', Context.Empty],
    ['++-O.p ** 10', Context.Empty],
    ['++-x ** 10', Context.Empty],
    ['--+O.p ** 10', Context.Empty],
    ['--+x ** 10', Context.Empty],
    // ["[ x ] **= [ 2 ]", Context.Empty],
    //["[ x **= 2 ] = [ 2 ]", Context.Empty],
    ['{ x } **= { x: 2 }', Context.Empty],
    ['{ x: x **= 2 ] = { x: 2 }', Context.Empty]
  ]);

  const validSyntax = [
    '(delete O.p) ** 10',
    '(delete x) ** 10',
    '(~O.p) ** 10',
    '(~x) ** 10',
    '(!O.p) ** 10',
    '(!x) ** 10',
    '(+O.p) ** 10',
    '(+x) ** 10',
    '(-O.p) ** 10',
    'x ** y ** z',
    '++x ** y',
    '(-x) ** y',
    '-(x ** y)',
    '(-x) ** 10',
    '(typeof O.p) ** 10',
    '(typeof x) ** 10',
    '(void 0) ** 10',
    '(void O.p) ** 10',
    '(void x) ** 10',
    '++O.p ** 10',
    '++x ** 10',
    '--O.p ** 10',
    '--x ** 10',
    'O.p++ ** 10',
    'x++ ** 10',
    'O.p-- ** 10',
    'x-- ** 10'
  ];
  for (const arg of validSyntax) {
    it(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
          undefined,
          Context.OptionsNext | Context.Module
        );
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsNext | Context.Module);
      });
    });
  }
  pass('Expressions - Exponentiation (pass)', [
    [
      '2 ** 4',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: 2
              },
              right: {
                type: 'Literal',
                value: 4
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'new x ** 2;',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'new x() ** 2;',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'a?b:c',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'true ** a',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'a=b?c:d',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '++x ** a',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '+a * b ** c ** 3',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                },
                prefix: true
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'Literal',
                    value: 3
                  },
                  operator: '**'
                },
                operator: '**'
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      'function *f() { yield x ** y }',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      operator: '**'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(2 ** 4)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: 2
              },
              right: {
                type: 'Literal',
                value: 4
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '(new x ** 2)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '(new x() ** 2)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
      }
    ],

    [
      '(true ** a)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],

    [
      '(++x ** a)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],

    [
      '(x-- ** a)',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '--',
                prefix: false
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],

    [
      'function *f() { (yield x ** y) }',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      operator: '**'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'x++ ** a',
      Context.Empty,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: false
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ]
  ]);
});
