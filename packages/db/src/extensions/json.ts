import { Prisma } from "../../prisma/generated/sqlite/client/index";

type FieldItem = `${string}.${string}`;
const jsonFields: FieldItem[] = ["widget.layout"] as const;
const splitFields = jsonFields.map((field) => field.split(".")) as [
  "widget",
  "layout",
][];
type JsonField<T extends {}, F extends string> = T & { [K in F]: {} };
export const jsonExtension = Prisma.defineExtension({
  name: "jsonParse",
  query: {
    $allModels: {
      $allOperations: async ({ model, args, operation, query }) => {
        const matchedModel = splitFields.find(
          (field) => field[0] === model.toLowerCase(),
        );
        if (operation.startsWith("find") && model && matchedModel) {
          const [model, field] = matchedModel;
          const result = await query(args);
          if (!result) return null;
          else if (typeof result === "number") return result;
          else if (Array.isArray(result)) {
            return result.map((r) => {
              if (field && field in r && r[field as keyof typeof r]) {
                try {
                  (r as JsonField<typeof r, typeof field>)[
                    field as keyof typeof r
                  ] = JSON.parse(r[field as keyof typeof r]!);
                } catch (e) {
                  console.error(e, "JSON PARSE FAILED FOR FIELD", {
                    model,
                    field,
                    operation,
                  });
                }
                return r;
              }
            });
          } else if (
            result &&
            field &&
            field in result &&
            result[field as keyof typeof result]
          ) {
            try {
              (result as JsonField<typeof result, typeof field>)[
                field as keyof typeof result
              ] = JSON.parse(result[field as keyof typeof result]! as string);
            } catch (e) {
              console.error(e, "JSON PARSE FAILED FOR FIELD", {
                model,
                field,
                operation,
              });
            }
          }

          return result;
        }

        return query(args);
      },
    },
  },
});
