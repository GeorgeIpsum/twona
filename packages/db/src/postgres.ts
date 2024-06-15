import * as validators from "../prisma/generated/postgres/zod";
import { PrismaClient } from "../prisma/generated/postgres/client";

const Postgres = PrismaClient;

export { validators };
export default Postgres;
