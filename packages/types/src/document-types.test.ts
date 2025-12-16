import { describe, it } from "@jest/globals";
import { expectType } from "@saiichihashimoto/test-utils";
import type { GeopointValue } from "sanity";

import { defineConfig, defineField, defineType } from ".";
import type { DocumentValues, InferSchemaValues } from ".";

describe("type DocumentValues", () => {
  it("infers union of sanity documents, including implicit ones", () => {
    const config = defineConfig({
      dataset: "dataset",
      projectId: "projectId",
      schema: {
        types: [
          defineType({
            name: "foo",
            type: "document",
            fields: [defineField({ name: "foo", type: "boolean" })],
          }),
          defineType({
            name: "bar",
            type: "document",
            fields: [defineField({ name: "bar", type: "number" })],
          }),
          defineType({ name: "qux", type: "string" }),
        ],
      },
    });

    expectType<DocumentValues<InferSchemaValues<typeof config>>>().toEqual<
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "bar";
          _updatedAt: string;
          bar?: number;
        }
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "foo";
          _updatedAt: string;
          foo?: boolean;
        }
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "sanity.fileAsset";
          _updatedAt: string;
          assetId: string;
          creditLine?: string;
          description?: string;
          extension: string;
          label?: string;
          metadata: { [key: string]: unknown };
          mimeType: string;
          originalFilename?: string;
          path: string;
          sha1hash: string;
          size: number;
          source?: { id: string; name: string; url?: string };
          title?: string;
          url: string;
        }
      | {
          _createdAt: string;
          _id: string;
          _rev: string;
          _type: "sanity.imageAsset";
          _updatedAt: string;
          assetId: string;
          creditLine?: string;
          description?: string;
          extension: string;
          label?: string;
          metadata: {
            [key: string]: unknown;
            _type: "sanity.imageMetadata";
            blurHash?: string;
            dimensions: {
              _type: "sanity.imageDimensions";
              aspectRatio: number;
              height: number;
              width: number;
            };
            exif?: {
              [key: string]: unknown;
              _type: "sanity.imageExifMetadata";
            };
            hasAlpha: boolean;
            isOpaque: boolean;
            location?: GeopointValue;
            lqip?: string;
            palette?: {
              _type: "sanity.imagePalette";
              darkMuted?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              darkVibrant?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              dominant?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              lightMuted?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              lightVibrant?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              muted?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
              vibrant?: {
                _type: "sanity.imagePaletteSwatch";
                background: string;
                foreground: string;
                population: number;
                title?: string;
              };
            };
          };
          mimeType: string;
          originalFilename?: string;
          path: string;
          sha1hash: string;
          size: number;
          source?: { id: string; name: string; url?: string };
          title?: string;
          url: string;
        }
    >();
  });
});
