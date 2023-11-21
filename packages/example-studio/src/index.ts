/**
 * This is how I'm exporting the types to be imported.
 *
 * It ultimately gets built into `dist/index.js` and `dist/index.t.ds` and usable by example-app by:
 * - The `build:tsup` script
 * - The `main`, `types`, and `files` fields in the `package.json`
 *
 * Every project setup will do things very differently, including this one.
 * Ultimately, you need to import SanityValues into your application to get any value.
 */
export { type SanityValues } from "../sanity.config";
