import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PrismaClient as Postgres } from "../generated/postgres/client";
import { PrismaClient as SQLite } from "../generated/sqlite/client";

const clients = [new Postgres(), new SQLite()];

const inputFiles = ["integrations.json"];
const inputPromise = Promise.all(
  inputFiles.map((file) =>
    readFile(resolve(process.cwd(), "prisma", "seed", file), "utf-8").then(
      (file) => JSON.parse(file),
    ),
  ),
);

async function main() {
  await Promise.all(clients.map(seed));
}

async function seed(client: (typeof clients)[number]) {
  const inputs = await inputPromise;
  const integrationInput = inputs.find(
    (input) => input.name === "integrations",
  );
  if (integrationInput) {
    const { integrations } = integrationInput;
    for (const integration of integrations) {
      // @ts-expect-error its aight
      await client.integration.upsert({
        update: integration,
        create: integration,
        where: { name: integration.name }
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    // @ts-expect-error ???
    const integrations = await Promise.all(clients.map(client => client.integration.findMany()));
    console.info("🌱  Seeded integrations:", integrations);
    process.exit(0);
  });
