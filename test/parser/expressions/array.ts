import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/cherow';

describe('Expressions - Array', () => {});

const validSyntax = [
  '[1 <= 0]',
  'let [a,,b] = c',
  '[a, ...b=c]',
  '[a, ...b=c]',
  '([a, ...b=c])',
  '[,,1,,,2,3,,]',
  '[ 1, 2,, 3, ]',
  '[ 0 ]',
  '[ ,, 0 ]',
  ' [,,3,,,]',
  '[,]',
  '[x()]',
  '[a, ...b]',
  '[function* f() {}]',
  '[a, ...{0: b}] = (1);',
  '[...{a}] = b;',
  '[...{a}] = b;',
  '[a, ...{0: b}] = 1',
  '[1, "z", "a", "Symbol(foo)"]',
  '[{...null}]',
  '[{...{a: 2, b: 3}, ... {c: 4, d: 5}}]',
  '[1, 2, 3, ...[]]',
  ' [...{}];',
  '[1,2,,4,5];',
  'var array = [,,,,,];',
  'var a = [,];',
  'let a = [];',
  'let b = [42];',
  'let c = [42, 7];',
  'let [d, ...e] = [1, 2, 3, 4, 5];'
];

for (const arg of validSyntax) {
  it(`${arg}`, () => {
    t.doesNotThrow(() => {
      parseSource(`${arg}`, undefined, Context.Empty);
    });
  });

  it(`${arg}`, () => {
    t.doesNotThrow(() => {
      parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
    });
  });

  it(`"use strict"; ${arg}`, () => {
    t.doesNotThrow(() => {
      parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
    });
  });
}

pass('Expressions - Array (pass)', [
  [
    '[a]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                name: 'a'
              }
            ]
          }
        }
      ]
    }
  ],
  [
    '[x()[y]] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: true,
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x.y = a] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x().y = a] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      arguments: []
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[a[x.y] = a] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: true,
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    property: {
                      type: 'MemberExpression',
                      computed: false,
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  },
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x()[y] = a ] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: true,
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      arguments: []
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x.y = a + b] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  right: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x().y = a + b] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      arguments: []
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  right: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[foo, [x,y,z], bar = B] = arr;',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ]
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'B'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'ArrayPattern',
                                  elements: [
                                    {
                                      type: 'ArrayPattern',
                                      elements: [
                                        {
                                          type: 'ArrayPattern',
                                          elements: [
                                            {
                                              type: 'ArrayPattern',
                                              elements: [
                                                {
                                                  type: 'ArrayPattern',
                                                  elements: [
                                                    {
                                                      type: 'ArrayPattern',
                                                      elements: [
                                                        {
                                                          type: 'ArrayPattern',
                                                          elements: [
                                                            {
                                                              type: 'ArrayPattern',
                                                              elements: [
                                                                {
                                                                  type: 'ArrayPattern',
                                                                  elements: [
                                                                    {
                                                                      type: 'Identifier',
                                                                      name: 'x'
                                                                    },
                                                                    {
                                                                      type: 'Identifier',
                                                                      name: 'y'
                                                                    },
                                                                    {
                                                                      type: 'Identifier',
                                                                      name: 'z'
                                                                    }
                                                                  ]
                                                                }
                                                              ]
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'B'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[foo, [x,y = 20,z], bar = B] = arr;',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        value: 20
                      }
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ]
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'B'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    'foo([a, b] = arr);',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'foo'
            },
            arguments: [
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'arr'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    'x, [foo, bar] = doo',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'SequenceExpression',
            expressions: [
              {
                type: 'Identifier',
                name: 'x'
              },
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'doo'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    'x, [foo = y, bar] = doo',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'SequenceExpression',
            expressions: [
              {
                type: 'Identifier',
                name: 'x'
              },
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'doo'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    'x = [a, b] = y',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[a, b] = c = d',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            },
            right: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'c'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              }
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[a,b=[x,y]] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  /* ['(foo, [bar, baz] = doo);', Context.Empty, {
"type": "Program",
"body": [
  {
      "type": "ExpressionStatement",
      "expression": {
          "type": "SequenceExpression",
          "expressions": [
              {
                  "type": "Identifier",
                  "name": "foo"
              },
              {
                  "type": "AssignmentExpression",
                  "operator": "=",
                  "left": {
                      "type": "ArrayPattern",
                      "elements": [
                          {
                              "type": "Identifier",
                              "name": "bar"
                          },
                          {
                              "type": "Identifier",
                              "name": "baz"
                          }
                      ]
                  },
                  "right": {
                      "type": "Identifier",
                      "name": "doo"
                  }
              }
          ]
      }
  }
],
"sourceType": "script"
}], */
  [
    '[x.y] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x().y] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[a[x.y]] = z',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: true,
                  object: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  property: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[5[foo]]=x',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: true,
                  object: {
                    type: 'Literal',
                    value: 5
                  },
                  property: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '["x".foo]=x',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'Literal',
                    value: 'x'
                  },
                  property: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x.y = z]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y'
                  }
                },
                right: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x + y]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x = y, z]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              {
                type: 'Identifier',
                name: 'z'
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[await = x]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'await'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x()]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x().foo]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'MemberExpression',
                computed: false,
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[[foo].length] = x',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  },
                  property: {
                    type: 'Identifier',
                    name: 'length'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x, y]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                name: 'x'
              },
              {
                type: 'Identifier',
                name: 'y'
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x = y]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x.y]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'MemberExpression',
                computed: false,
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ]
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[]',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: []
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[,]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [null]
          }
        }
      ]
    }
  ],
  [
    '[,,]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [null, null]
          }
        }
      ]
    }
  ],
  [
    '[x,]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                name: 'x'
              }
            ]
          }
        }
      ]
    }
  ],
  [
    '[x,,,]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                name: 'x'
              },
              null,
              null
            ]
          }
        }
      ]
    }
  ],
  [
    '[x,,y]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                name: 'x'
              },
              null,
              {
                type: 'Identifier',
                name: 'y'
              }
            ]
          }
        }
      ]
    }
  ],
  [
    '[foo = A] = arr;',
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
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'A'
                  }
                }
              ]
            },
            operator: '=',
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ]
    }
  ],
  [
    '[foo, bar] = arr;',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'Identifier',
                  name: 'bar'
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[foo = A, bar = B] = arr;',
    Context.Empty,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'A'
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'B'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        }
      ],
      sourceType: 'script'
    }
  ],
  [
    '[x &= 42]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '&=',
                right: {
                  type: 'Literal',
                  value: 42
                }
              }
            ]
          }
        }
      ]
    }
  ],
  [
    '[a = 2]',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 2
                }
              }
            ]
          }
        }
      ]
    }
  ]
]);
