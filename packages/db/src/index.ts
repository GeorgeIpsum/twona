import { PrismaClient } from "@prisma/client";

import * as validators from "../prisma/generated/zod";

const DB = PrismaClient;

export { validators };
export default DB;
