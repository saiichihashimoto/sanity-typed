import { describe, it } from "@jest/globals";
import type { ImageCrop, ImageHotspot, ReferenceValue } from "sanity";

import { expectType } from "@sanity-typed/test-utils";

import { _makeDefineArrayMember, defineArrayMember, defineField } from "..";
import type { _InferValue } from "..";

const defineArrayMember2 = _makeDefineArrayMember<true>();

describe("depth test", () => {
  it("defineArrayMember 22 deep works", () => {
    const array23Deep = defineArrayMember2({
      type: "array",
      of: [
        defineArrayMember2({
          type: "array",
          of: [
            defineArrayMember2({
              type: "array",
              of: [
                defineArrayMember2({
                  type: "array",
                  of: [
                    defineArrayMember2({
                      type: "array",
                      of: [
                        defineArrayMember2({
                          type: "array",
                          of: [
                            defineArrayMember2({
                              type: "array",
                              of: [
                                defineArrayMember2({
                                  type: "array",
                                  of: [
                                    defineArrayMember2({
                                      type: "array",
                                      of: [
                                        defineArrayMember2({
                                          type: "array",
                                          of: [
                                            defineArrayMember2({
                                              type: "array",
                                              of: [
                                                defineArrayMember2({
                                                  type: "array",
                                                  of: [
                                                    defineArrayMember2({
                                                      type: "array",
                                                      of: [
                                                        defineArrayMember2({
                                                          type: "array",
                                                          of: [
                                                            defineArrayMember2({
                                                              type: "array",
                                                              of: [
                                                                defineArrayMember2(
                                                                  {
                                                                    type: "array",
                                                                    of: [
                                                                      defineArrayMember2(
                                                                        {
                                                                          type: "array",
                                                                          of: [
                                                                            defineArrayMember2(
                                                                              {
                                                                                type: "array",
                                                                                of: [
                                                                                  defineArrayMember2(
                                                                                    {
                                                                                      type: "array",
                                                                                      of: [
                                                                                        defineArrayMember2(
                                                                                          {
                                                                                            type: "array",
                                                                                            of: [
                                                                                              defineArrayMember2(
                                                                                                {
                                                                                                  type: "array",
                                                                                                  of: [
                                                                                                    defineArrayMember2(
                                                                                                      {
                                                                                                        type: "array",
                                                                                                        of: [
                                                                                                          defineArrayMember2(
                                                                                                            {
                                                                                                              type: "array",
                                                                                                              of: [
                                                                                                                defineArrayMember2(
                                                                                                                  {
                                                                                                                    type: "boolean",
                                                                                                                  }
                                                                                                                ),
                                                                                                              ],
                                                                                                            }
                                                                                                          ),
                                                                                                        ],
                                                                                                      }
                                                                                                    ),
                                                                                                  ],
                                                                                                }
                                                                                              ),
                                                                                            ],
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                    }
                                                                                  ),
                                                                                ],
                                                                              }
                                                                            ),
                                                                          ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // @ts-expect-error -- breaks at 23
    expectType<_InferValue<typeof array23Deep>>().toStrictEqual<
      boolean[][][][][][][][][][][][][][][][][][][][][][][]
    >();

    // If this is before array23Deep, it somehow reuses the calculation. idk
    const array22Deep = defineArrayMember2({
      type: "array",
      of: [
        defineArrayMember2({
          type: "array",
          of: [
            defineArrayMember2({
              type: "array",
              of: [
                defineArrayMember2({
                  type: "array",
                  of: [
                    defineArrayMember2({
                      type: "array",
                      of: [
                        defineArrayMember2({
                          type: "array",
                          of: [
                            defineArrayMember2({
                              type: "array",
                              of: [
                                defineArrayMember2({
                                  type: "array",
                                  of: [
                                    defineArrayMember2({
                                      type: "array",
                                      of: [
                                        defineArrayMember2({
                                          type: "array",
                                          of: [
                                            defineArrayMember2({
                                              type: "array",
                                              of: [
                                                defineArrayMember2({
                                                  type: "array",
                                                  of: [
                                                    defineArrayMember2({
                                                      type: "array",
                                                      of: [
                                                        defineArrayMember2({
                                                          type: "array",
                                                          of: [
                                                            defineArrayMember2({
                                                              type: "array",
                                                              of: [
                                                                defineArrayMember2(
                                                                  {
                                                                    type: "array",
                                                                    of: [
                                                                      defineArrayMember2(
                                                                        {
                                                                          type: "array",
                                                                          of: [
                                                                            defineArrayMember2(
                                                                              {
                                                                                type: "array",
                                                                                of: [
                                                                                  defineArrayMember2(
                                                                                    {
                                                                                      type: "array",
                                                                                      of: [
                                                                                        defineArrayMember2(
                                                                                          {
                                                                                            type: "array",
                                                                                            of: [
                                                                                              defineArrayMember2(
                                                                                                {
                                                                                                  type: "array",
                                                                                                  of: [
                                                                                                    defineArrayMember2(
                                                                                                      {
                                                                                                        type: "array",
                                                                                                        of: [
                                                                                                          defineArrayMember2(
                                                                                                            {
                                                                                                              type: "boolean",
                                                                                                            }
                                                                                                          ),
                                                                                                        ],
                                                                                                      }
                                                                                                    ),
                                                                                                  ],
                                                                                                }
                                                                                              ),
                                                                                            ],
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                    }
                                                                                  ),
                                                                                ],
                                                                              }
                                                                            ),
                                                                          ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    expectType<_InferValue<typeof array22Deep>>().toStrictEqual<
      boolean[][][][][][][][][][][][][][][][][][][][][][]
    >();
  });

  it("defineArrayMember with object 22 deep works", () => {
    const array23Deep = defineArrayMember2({
      type: "array",
      of: [
        defineArrayMember2({
          type: "array",
          of: [
            defineArrayMember2({
              type: "array",
              of: [
                defineArrayMember2({
                  type: "array",
                  of: [
                    defineArrayMember2({
                      type: "array",
                      of: [
                        defineArrayMember2({
                          type: "array",
                          of: [
                            defineArrayMember2({
                              type: "array",
                              of: [
                                defineArrayMember2({
                                  type: "array",
                                  of: [
                                    defineArrayMember2({
                                      type: "array",
                                      of: [
                                        defineArrayMember2({
                                          type: "array",
                                          of: [
                                            defineArrayMember2({
                                              type: "array",
                                              of: [
                                                defineArrayMember2({
                                                  type: "array",
                                                  of: [
                                                    defineArrayMember2({
                                                      type: "array",
                                                      of: [
                                                        defineArrayMember2({
                                                          type: "array",
                                                          of: [
                                                            defineArrayMember2({
                                                              type: "array",
                                                              of: [
                                                                defineArrayMember2(
                                                                  {
                                                                    type: "array",
                                                                    of: [
                                                                      defineArrayMember2(
                                                                        {
                                                                          type: "array",
                                                                          of: [
                                                                            defineArrayMember2(
                                                                              {
                                                                                type: "array",
                                                                                of: [
                                                                                  defineArrayMember2(
                                                                                    {
                                                                                      type: "array",
                                                                                      of: [
                                                                                        defineArrayMember2(
                                                                                          {
                                                                                            type: "array",
                                                                                            of: [
                                                                                              defineArrayMember2(
                                                                                                {
                                                                                                  type: "array",
                                                                                                  of: [
                                                                                                    defineArrayMember2(
                                                                                                      {
                                                                                                        type: "array",
                                                                                                        of: [
                                                                                                          defineArrayMember2(
                                                                                                            {
                                                                                                              type: "array",
                                                                                                              of: [
                                                                                                                defineArrayMember2(
                                                                                                                  {
                                                                                                                    type: "slug",
                                                                                                                  }
                                                                                                                ),
                                                                                                              ],
                                                                                                            }
                                                                                                          ),
                                                                                                        ],
                                                                                                      }
                                                                                                    ),
                                                                                                  ],
                                                                                                }
                                                                                              ),
                                                                                            ],
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                    }
                                                                                  ),
                                                                                ],
                                                                              }
                                                                            ),
                                                                          ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // @ts-expect-error -- breaks at 23
    expectType<_InferValue<typeof array23Deep>>().toStrictEqual<
      ({
        _key: string;
      } & {
        _type: "slug";
        current: string;
      })[][][][][][][][][][][][][][][][][][][][][][][]
    >();

    // If this is before array23Deep, it somehow reuses the calculation. idk
    const array22Deep = defineArrayMember2({
      type: "array",
      of: [
        defineArrayMember2({
          type: "array",
          of: [
            defineArrayMember2({
              type: "array",
              of: [
                defineArrayMember2({
                  type: "array",
                  of: [
                    defineArrayMember2({
                      type: "array",
                      of: [
                        defineArrayMember2({
                          type: "array",
                          of: [
                            defineArrayMember2({
                              type: "array",
                              of: [
                                defineArrayMember2({
                                  type: "array",
                                  of: [
                                    defineArrayMember2({
                                      type: "array",
                                      of: [
                                        defineArrayMember2({
                                          type: "array",
                                          of: [
                                            defineArrayMember2({
                                              type: "array",
                                              of: [
                                                defineArrayMember2({
                                                  type: "array",
                                                  of: [
                                                    defineArrayMember2({
                                                      type: "array",
                                                      of: [
                                                        defineArrayMember2({
                                                          type: "array",
                                                          of: [
                                                            defineArrayMember2({
                                                              type: "array",
                                                              of: [
                                                                defineArrayMember2(
                                                                  {
                                                                    type: "array",
                                                                    of: [
                                                                      defineArrayMember2(
                                                                        {
                                                                          type: "array",
                                                                          of: [
                                                                            defineArrayMember2(
                                                                              {
                                                                                type: "array",
                                                                                of: [
                                                                                  defineArrayMember2(
                                                                                    {
                                                                                      type: "array",
                                                                                      of: [
                                                                                        defineArrayMember2(
                                                                                          {
                                                                                            type: "array",
                                                                                            of: [
                                                                                              defineArrayMember2(
                                                                                                {
                                                                                                  type: "array",
                                                                                                  of: [
                                                                                                    defineArrayMember2(
                                                                                                      {
                                                                                                        type: "array",
                                                                                                        of: [
                                                                                                          defineArrayMember2(
                                                                                                            {
                                                                                                              type: "slug",
                                                                                                            }
                                                                                                          ),
                                                                                                        ],
                                                                                                      }
                                                                                                    ),
                                                                                                  ],
                                                                                                }
                                                                                              ),
                                                                                            ],
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                    }
                                                                                  ),
                                                                                ],
                                                                              }
                                                                            ),
                                                                          ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    expectType<_InferValue<typeof array22Deep>>().toStrictEqual<
      ({
        _key: string;
      } & {
        _type: "slug";
        current: string;
      })[][][][][][][][][][][][][][][][][][][][][][]
    >();
  });

  it("#108 object -> array -> object -> object -> array -> object -> image", () => {
    // https://github.com/saiichihashimoto/sanity-typed/issues/108
    const type = defineField({
      name: "foo",
      type: "object",
      fields: [
        defineField({
          name: "foo",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "foo",
                  type: "object",
                  fields: [
                    defineField({
                      name: "foo",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "object",
                          fields: [
                            defineField({
                              name: "foo",
                              type: "image",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    expectType<_InferValue<typeof type>>().toStrictEqual<{
      foo?: ({
        _key: string;
      } & {
        foo?: {
          foo?: ({
            _key: string;
          } & {
            foo?: {
              asset?: ReferenceValue;
              crop?: ImageCrop;
              hotspot?: ImageHotspot;
            };
          })[];
        };
      })[];
    }>();
  });
});
