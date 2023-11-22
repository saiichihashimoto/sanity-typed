import type { InferGetStaticPropsType } from "next";

import { makeTypedQuery } from "../sanity/client";

// import { makeTypedQuery } from "../sanity/mocked-client";
// import { makeTypedQuery } from "../sanity/swapping-client";

export const getStaticProps = async () => ({
  props: {
    products: await makeTypedQuery(),
  },
});

const Index = ({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <h1>Products</h1>
    <ul>
      {products.map(({ _id, productName, tags }) => (
        <li key={_id}>
          <h2>{productName}</h2>
          {tags?.length && (
            <ul>
              {tags.map(({ _key, label, value }) => (
                <li key={_key}>
                  {label && <h3>{label}</h3>}
                  {value && <p>{value}</p>}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
    <hr />
    <pre style={{ padding: 4 }}>
      products = {JSON.stringify(products, null, 4)}
    </pre>
    <style
      dangerouslySetInnerHTML={{
        __html: "body{background:black;color:white;font-size:18px;}",
      }}
    />
  </>
);

export default Index;
