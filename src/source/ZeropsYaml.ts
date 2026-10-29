import * as Effect from "effect/Effect";
import { parse, stringify } from "yaml";
import { ZeropsSourceError } from "./SourceError.ts";
import type { ZeropsYamlDoc } from "./ZeropsYamlTypes.ts";
export type { ZeropsYamlDoc, ZeropsYamlSetup } from "./ZeropsYamlTypes.ts";

export const renderZeropsYaml = (input: string | ZeropsYamlDoc): string =>
  typeof input === "string" ? input : stringify(input, { lineWidth: 0 });

export const zeropsYamlSetups = (
  yamlText: string,
): Effect.Effect<ReadonlyArray<string>, ZeropsSourceError> =>
  Effect.try({
    try: () => {
      let doc: unknown;
      try {
        doc = parse(yamlText);
      } catch {
        throw new Error("Invalid Zerops YAML syntax");
      }
      if (!doc || typeof doc !== "object" || !("zerops" in doc) || !Array.isArray(doc.zerops))
        throw new Error("Invalid Zerops YAML: expected a zerops array");
      return doc.zerops.map((entry: unknown, index: number) => {
        if (
          !entry ||
          typeof entry !== "object" ||
          !("setup" in entry) ||
          typeof entry.setup !== "string" ||
          !entry.setup.trim()
        )
          throw new Error(`Invalid Zerops YAML: zerops[${index}].setup must be a nonempty string`);
        return entry.setup;
      });
    },
    catch: (cause) =>
      new ZeropsSourceError({
        message: cause instanceof Error ? cause.message : "Invalid Zerops YAML",
      }),
  });
