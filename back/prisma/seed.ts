import { PrismaClient } from "@prisma/client";
import { seed_dfl } from "./seed_tools/Automatisation";

const prisma = new PrismaClient();

async function main() {
	await seed_dfl()
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(()=> {prisma.$disconnect(); })