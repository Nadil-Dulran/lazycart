import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

// Type definitions
// declare global {
//   var prisma: PrismaClient | undefined
// }

const connectionString = `${process.env.DATABASE_URL}`;
const isNeon = typeof connectionString === 'string' && connectionString.includes('neon.tech');

// Prefer Neon adapter when on Edge or when Prisma engine type is 'client'
const adapter = new PrismaNeon({ connectionString });

// Build options safely based on runtime and engine type
const engineType = process.env.PRISMA_CLIENT_ENGINE_TYPE; // e.g., 'client', 'binary', 'library'
let clientOptions = {};

if (process.env.NEXT_RUNTIME === 'edge') {
	clientOptions = { adapter };
} else if (engineType === 'client') {
	// Engine type 'client' requires either an adapter or accelerateUrl
	if (isNeon) {
		clientOptions = { adapter };
	} else if (process.env.PRISMA_ACCELERATE_URL) {
		clientOptions = { accelerateUrl: process.env.PRISMA_ACCELERATE_URL };
	} else {
		// Fallback to binary engine for standard Node envs
		process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
		clientOptions = {};
	}
}

const prisma = global.prisma || new PrismaClient(clientOptions);

if (process.env.NEXT_RUNTIME !== 'edge') global.prisma = prisma;

export default prisma;