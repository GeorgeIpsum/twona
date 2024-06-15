import * as validators from "../prisma/generated/sqlite/zod";
import { PrismaClient } from "../prisma/generated/sqlite/client";

const Sqlite = PrismaClient;

export { validators };
export default Sqlite;
