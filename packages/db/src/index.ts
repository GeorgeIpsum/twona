import * as validators from "../prisma/generated/zod";
import { PrismaClient } from "../prisma/generated/client";

const DB = PrismaClient;

export { validators };
export default DB;
