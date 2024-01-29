## Usage with `groqd` (actually `groq-builder`)

[@scottrippey](https://github.com/scottrippey) is working on an amazing typed [`groqd`](https://formidable.com/open-source/groqd/) called [`groq-builder`](https://github.com/FormidableLabs/groqd/tree/main/packages/groq-builder), a schema-aware, strongly-typed GROQ query builder with auto-completion and type-checking for your GROQ queries. When given a function, `fetch` will provide a GROQ builder for your use:

```bash
npm install groq-builder
```

@[typescript](../packages/example-app/src/sanity/client-with-groq-builder.ts)

It will use the returned `query` and `parse` directly so you get typed results and runtime validation.

Deciding between using `groq-builder` or directly typed queries is your decision! There are pros or cons to consider:

- Typescript isn't optimized for parsing strings the way [`@sanity-typed/groq`](../packages/groq) does, which can run into strange errors. Meanwhile, a builder is typescript-first, allowing for complex structures without any issues.
- Runtime validation is amazing! It was something [I considered and abandoned](https://github.com/saiichihashimoto/sanity-typed/issues/306) so it's great to have a solution.
- The way `@sanity-typed/groq` had to be written, it can't do any auto-completion in IDEs like `groq-builder` can. There was no way around this. Typed objects and methods are going to be superior to parsing a string. Again, typescript wasn't made for it.
- There _is_ something to be said for writing queries in their native syntax with less layers between. Writing GROQ queries directly lets you concern yourself only with their documentation, especially when issues arise.
- I'm not 100% certain that `groq-builder` handles all GROQ operations.
- `groq-builder` is currently in beta. You'll need to reference [`groqd`'s documentation](https://formidable.com/open-source/groqd/) and sometimes they don't match 1-to-1.
