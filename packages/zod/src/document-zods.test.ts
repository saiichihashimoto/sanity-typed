import { describe, expect, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { z } from "zod";

import { defineConfig, defineField, defineType } from "@sanity-typed/types";
import type { DocumentValues, InferSchemaValues } from "@sanity-typed/types";

import { sanityConfigToZods, sanityDocumentsZod } from ".";

describe("documentZods", () => {
  it("builds parser for union of only sanity documents", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [
              defineField({
                name: "foo",
                type: "boolean",
              }),
            ],
          }),
          defineType({
            name: "bar",
            type: "document",
            fields: [
              defineField({
                name: "bar",
                type: "number",
              }),
            ],
          }),
          defineType({
            name: "baz",
            type: "string",
          }),
        ],
      },
    });
    const zods = sanityConfigToZods(config);
    const documentsZod = sanityDocumentsZod(config, zods);

    expectType<z.infer<typeof documentsZod>>().toStrictEqual<
      DocumentValues<InferSchemaValues<typeof config>>
    >();

    const foo = {
      _createdAt: "createdAt",
      _id: "id",
      _rev: "rev",
      _type: "foo",
      _updatedAt: "updatedAt",
      foo: true,
    };

    expect(documentsZod.parse(foo)).toStrictEqual(foo);

    const bar = {
      _createdAt: "createdAt",
      _id: "id",
      _rev: "rev",
      _type: "bar",
      _updatedAt: "updatedAt",
      bar: 1,
    };

    expect(documentsZod.parse(bar)).toStrictEqual(bar);

    const fileAsset = {
      _createdAt: "createdAt",
      _id: "id",
      _rev: "rev",
      _type: "sanity.fileAsset",
      _updatedAt: "updatedAt",
      assetId: "assetId",
      creditLine: "creditLine",
      description: "description",
      extension: "extension",
      label: "label",
      mimeType: "mimeType",
      originalFilename: "originalFilename",
      path: "path",
      sha1hash: "sha1hash",
      size: 0,
      title: "title",
      url: "http://google.com",
      metadata: { key: "value" },
      source: {
        id: "id",
        name: "name",
        url: "http://google.com",
      },
    };

    expect(documentsZod.parse(fileAsset)).toStrictEqual(fileAsset);

    const imageAsset = {
      _createdAt: "createdAt",
      _id: "id",
      _rev: "rev",
      _type: "sanity.imageAsset",
      _updatedAt: "updatedAt",
      assetId: "assetId",
      creditLine: "creditLine",
      description: "description",
      extension: "extension",
      label: "label",
      mimeType: "mimeType",
      originalFilename: "originalFilename",
      path: "path",
      sha1hash: "sha1hash",
      size: 0,
      title: "title",
      url: "http://google.com",
      source: {
        id: "id",
        name: "name",
        url: "http://google.com",
      },
      metadata: {
        key: "value",
        _type: "sanity.imageMetadata",
        blurHash: "blurHash",
        hasAlpha: false,
        isOpaque: false,
        lqip: "lqip",
        dimensions: {
          _type: "sanity.imageDimensions",
          aspectRatio: 0,
          height: 0,
          width: 0,
        },
        palette: {
          _type: "sanity.imagePalette",
          darkMuted: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          darkVibrant: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          dominant: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          lightMuted: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          lightVibrant: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          muted: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
          vibrant: {
            _type: "sanity.imagePaletteSwatch",
            background: "background",
            foreground: "foreground",
            population: 0,
            title: "title",
          },
        },
      },
    };

    expect(documentsZod.parse(imageAsset)).toStrictEqual(imageAsset);

    expect(() => documentsZod.parse("baz")).toThrow("Invalid input");
  });
});
