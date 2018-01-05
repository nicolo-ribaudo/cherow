import { pass, fail } from '../utils';

describe('Miscellaneous - Comments', () => {

    fail(`;-->`, {
        source: `;-->`,
        message: 'Unexpected token \'>\'',
        line: 1,
        column: 3,
        index: 4,
    });

    fail(`single and multi line comments used together`, {
        source: `// var /*
        x*/`,
        message: 'Unterminated regular expression literal',
        line: 2,
        column: 10,
        index: 22,
    });

    fail(`single and multi line comments used together`, {
        source: `<!-`,
        message: 'Unexpected token \'end of source\'',
        line: 1,
        column: 2,
        index: 3,
    });

    fail(`single and multi line comments used together`, {
        source: `<!`,
        message: 'Unexpected token \'end of source\'',
        line: 1,
        column: 1,
        index: 2,
    });

    fail(`single and multi line comments used together`, {
        source: `// var /*
        x*/`
    });

    fail(`nested multi line comments`, {
        source: `/* x */
        = 1;
        */`,
        message: 'Unexpected token \'=\'',
        line: 2,
        column: 8,
        index: 17
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
        message: 'Unexpected token \'identifier\'',
        line: 2,
        column: 15,
        index: 25
    });

    fail(`/*FOO/`, {
        source: `/*FOO/`,
        message: 'Unterminated comment',
        line: 1,
        column: 0,
        index: 6
    });

    fail(`multiline comment at the end of single line comment`, {
        source: `// var /*
        x*/`,
        message: 'Unterminated regular expression literal',
        line: 2,
        column: 10,
        index: 22
    });

    fail(`<!-- HTML comment`, {
        source: `<!-- HTML comment`,
        module: true,
        message: 'Unexpected token \'identifier\'',
        line: 1,
        column: 10,
        index: 17
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    fail(`arbitrary character sequence before HTMLCloseComment token`, {
        source: `/*
        */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    });

    pass(`//"𠮷"
    /*"𠮷"*/a;
`, {
        source: `//"𠮷"
        /*"𠮷"*/a;
    `,
        loc: true,
        ranges: true,
        raw: true,
        expected: {
              body: [
                {
                 end: 25,
                  expression: {
                    end: 24,
                    loc: {
                      end: {
                        column: 17,
                        line: 2,
                      },
                      start: {
                        column: 16,
                        line: 2,
                      }
                    },
                    name: 'a',
                    start: 23,
                    type: 'Identifier'
                  },
                  loc: {
                   end: {
                      column: 18,
                      line: 2,
                    },
                    start: {
                      column: 16,
                      line: 2,
                    }
                  },
                  start: 23,
                  type: 'ExpressionStatement'
                }
              ],
              end: 30,
              loc: {
               end: {
                  column: 4,
                  line: 3,
                },
                start: {
                  column: 0,
                  line: 1,
                }
              },
              sourceType: 'script',
              start: 0,
              type: 'Program'
            }
    });

    pass(`<!-- HTML comment`, {
        source: '<!-- HTML comment',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 17,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 17
                }
            },
            body: [],
            sourceType: 'script'
        }
    });

    pass(`;\n--> HTML comment`, {
        source: ';\n--> HTML comment',
        ranges: true,
        raw: true,
        expected: {
            body: [{
                end: 1,
                start: 0,
                type: 'EmptyStatement'
            }],
            end: 18,
            sourceType: 'script',
            start: 0,
            type: 'Program'
        }
    });

    pass(`function declaration`, {
        source: '//\rfoo\n',
        ranges: true,
        raw: true,
        expected: {
            body: [{
                end: 6,
                expression: {
                    end: 6,
                    name: 'foo',
                    start: 3,
                    type: 'Identifier'
                },
                start: 3,
                type: 'ExpressionStatement'
            }],
            end: 7,
            sourceType: 'script',
            start: 0,
            type: 'Program'
        }
    });

    pass(`//\nfoo\r\t`, {
        source: '//\nfoo\r\t',
        ranges: true,
        raw: true,
        expected: {
            body: [{
                end: 6,
                expression: {
                    end: 6,
                    name: 'foo',
                    start: 3,
                    type: 'Identifier'
                },
                start: 3,
                type: 'ExpressionStatement'
            }],
            end: 8,
            sourceType: 'script',
            start: 0,
            type: 'Program'
        }
    });

    pass(`/****/`, {
        source: '/****/',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 6,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 6
                }
            },
            body: [],
            sourceType: 'script'
        }
    });

    pass(`/**/42`, {
        source: '/**/42',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 6,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 6
                }
            },
            body: [{
                type: 'ExpressionStatement',
                start: 4,
                end: 6,
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 6
                    }
                },
                expression: {
                    type: 'Literal',
                    start: 4,
                    end: 6,
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    },
                    value: 42,
                    raw: '42'
                }
            }],
            sourceType: 'script'
        }
    });

    pass(`function x(){ /*foo*/ return; /*bar*/}`, {
        source: 'function x(){ /*foo*/ return; /*bar*/}',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 38,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 38
              }
            },
            body: [
              {
                type: 'FunctionDeclaration',
                start: 0,
                end: 38,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 38
                  }
                },
                id: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  loc: {
                    start: {
                      line: 1,
                      column: 9
                    },
                    end: {
                      line: 1,
                      column: 10
                    }
                  },
                  name: 'x'
                },
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 12,
                  end: 38,
                  loc: {
                    start: {
                      line: 1,
                      column: 12
                    },
                    end: {
                      line: 1,
                      column: 38
                    }
                  },
                  body: [
                    {
                      type: 'ReturnStatement',
                      start: 22,
                      end: 29,
                      loc: {
                        start: {
                          line: 1,
                          column: 22
                        },
                        end: {
                          line: 1,
                          column: 29
                        }
                      },
                      argument: null
                    }
                  ]
                }
              }
            ],
            sourceType: 'script'
          }
    });

    pass(`0 /*The*/ /*Answer*/`, {
        source: '0 /*The*/ /*Answer*/',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 20,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 20
              }
            },
            body: [
              {
                type: 'ExpressionStatement',
                start: 0,
                end: 1,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                expression: {
                  type: 'Literal',
                  start: 0,
                  end: 1,
                  loc: {
                    start: {
                      line: 1,
                      column: 0
                    },
                    end: {
                      line: 1,
                      column: 1
                    }
                  },
                  value: 0,
                  raw: '0'
                }
              }
            ],
            sourceType: 'script'
          }
    });

    pass(`if (x) { // Some comment\ndoThat(); }`, {
        source: 'if (x) { // Some comment\ndoThat(); }',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            body: [{
                alternate: null,
                consequent: {
                    body: [{
                        end: 34,
                        expression: {
                            arguments: [],
                            callee: {
                                end: 31,
                                loc: {
                                    end: {
                                        column: 6,
                                        line: 2,
                                    },
                                    start: {
                                        column: 0,
                                        line: 2,
                                    }
                                },
                                name: 'doThat',
                                start: 25,
                                type: 'Identifier',
                            },
                            end: 33,
                            loc: {
                                end: {
                                    column: 8,
                                    line: 2,
                                },
                                start: {
                                    column: 0,
                                    line: 2,
                                }
                            },
                            start: 25,
                            type: 'CallExpression',
                        },
                        loc: {
                            end: {
                                column: 9,
                                line: 2,
                            },
                            start: {
                                column: 0,
                                line: 2,
                            },
                        },
                        start: 25,
                        type: 'ExpressionStatement'
                    }, ],
                    end: 36,
                    loc: {
                        end: {
                            column: 11,
                            line: 2,
                        },
                        start: {
                            column: 7,
                            line: 1,
                        },
                    },
                    start: 7,
                    type: 'BlockStatement',
                },
                end: 36,
                loc: {
                    end: {
                        column: 11,
                        line: 2,
                    },
                    start: {
                        column: 0,
                        line: 1,
                    }
                },
                start: 0,
                test: {
                    end: 5,
                    loc: {
                        end: {
                            column: 5,
                            line: 1,
                        },
                        start: {
                            column: 4,
                            line: 1,
                        },
                    },
                    name: 'x',
                    start: 4,
                    type: 'Identifier',
                },
                type: 'IfStatement'
            }],
            end: 36,
            loc: {
                end: {
                    column: 11,
                    line: 2,
                },
                start: {
                    column: 0,
                    line: 1,
                },
            },
            sourceType: 'script',
            start: 0,
            type: 'Program',
        }
    });

    pass(`/**/ function a() {/**/function o() {}}`, {
        source: '/**/ function a() {/**/function o() {}}',
        loc: true,
        ranges: true,
        raw: true,
        expected: {
            type: 'Program',
            start: 0,
            end: 39,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 39
              }
            },
            body: [
              {
                type: 'FunctionDeclaration',
                start: 5,
                end: 39,
                loc: {
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 39
                  }
                },
                id: {
                  type: 'Identifier',
                  start: 14,
                  end: 15,
                  loc: {
                    start: {
                      line: 1,
                      column: 14
                    },
                    end: {
                      line: 1,
                      column: 15
                    }
                  },
                  name: 'a'
                },
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 18,
                  end: 39,
                  loc: {
                    start: {
                      line: 1,
                      column: 18
                    },
                    end: {
                      line: 1,
                      column: 39
                    }
                  },
                  body: [
                    {
                      type: 'FunctionDeclaration',
                      start: 23,
                      end: 38,
                      loc: {
                        start: {
                          line: 1,
                          column: 23
                        },
                        end: {
                          line: 1,
                          column: 38
                        }
                      },
                      id: {
                        type: 'Identifier',
                        start: 32,
                        end: 33,
                        loc: {
                          start: {
                            line: 1,
                            column: 32
                          },
                          end: {
                            line: 1,
                            column: 33
                          }
                        },
                        name: 'o'
                      },
                      generator: false,
                      expression: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 36,
                        end: 38,
                        loc: {
                          start: {
                            line: 1,
                            column: 36
                          },
                          end: {
                            line: 1,
                            column: 38
                          }
                        },
                        body: []
                      }
                    }
                  ]
                }
              }
            ],
            sourceType: 'script'
          }
    });

    pass(`/* block comment */--> comment`, {
        source: '/* block comment */--> comment',
        comments: true,
        loc: true,
        ranges: true,
        raw: true,
        expected: {
              body: [],
              comments: [
                {
                  end: 19,
                  loc: {
                    end: {
                      column: 19,
                      line: 1,
                    },
                    start: {
                     column: 0,
                      line: 1,
                    }
                  },
                  start: 0,
                  type: 'BlockComment',
                  value: ' block comment ',
                },
                {
                  end: 30,
                  loc: {
                    end: {
                     column: 30,
                      line: 1,
                    },
                   start: {
                      column: 19,
                      line: 1,
                    },
                  },
                  start: 19,
                  type: 'LineComment',
                  value: ' comment',
               }
              ],
              end: 30,
              loc: {
                end: {
                  column: 30,
                  line: 1,
                },
                start: {
                  column: 0,
                  line: 1,
               },
              },
              sourceType: 'script',
              start: 0,
              type: 'Program'
            }
    });

    pass(`0/*\n*/--> a comment`, {
        source: '0/*\n*/--> a comment',
        comments: true,
        loc: true,
        ranges: true,
        raw: true,
        expected: {
              body: [
                {
                  end: 1,
                  expression: {
                    end: 1,
                    loc: {
                      end: {
                        column: 1,
                       line: 1,
                      },
                      start: {
                        column: 0,
                        line: 1,
                      }
                    },
                    raw: '0',
                    start: 0,
                    type: 'Literal',
                    value: 0,
                  },
                  loc: {
                    end: {
                      column: 1,
                      line: 1,
                    },
                    start: {
                      column: 0,
                      line: 1,
                    }
                  },
                  start: 0,
                  type: 'ExpressionStatement'
                }
              ],
              comments: [
                {
                  end: 6,
                  loc: {
                    end: {
                      column: 2,
                      line: 1,
                    },
                    start: {
                      column: 1,
                      line: 1,
                    }
                  },
                  start: 1,
                 type: 'BlockComment',
                  value: '\n',
                },
                {
                  end: 19,
                  loc: {
                    end: {
                      column: 15,
                      line: 1,
                    },
                    start: {
                      column: 2,
                      line: 2,
                   }
                  },
                  start: 6,
                  type: 'LineComment',
                  value: ' a comment',
                },
              ],
              end: 19,
              loc: {
                end: {
                  column: 15,
                  line: 2,
                },
                start: {
                  column: 0,
                  line: 1,
                },
              },
              sourceType: 'script',
              start: 0,
              type: 'Program',
            }
    });

});