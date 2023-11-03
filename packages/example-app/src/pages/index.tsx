import type { InferGetStaticPropsType } from "next";

import { makeTypedQuery } from "../sanity/client";

export const getStaticProps = async () => ({
  props: {
    products: await makeTypedQuery(),
  },
});

const Index = ({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    {products.map(({ _id, productName, tags }) => (
      <div key={_id}>
        <h1>{productName}</h1>
        {(tags ?? []).map(({ _key, label, value }) => (
          <div key={_key}>
            {label && <h2>{label}</h2>}
            {value && <p>{value}</p>}
          </div>
        ))}
      </div>
    ))}
  </>
);

export default Index;
