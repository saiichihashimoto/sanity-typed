### Config in Runtime

`@sanity-typed/*` generally has the goal of only having effect to types and no runtime effects. This package is an exception. This means that you will have to import your sanity config to use this. While sanity v3 is better than v2 at having a standard build environment, you will have to handle any nuances, including having a much larger build.
