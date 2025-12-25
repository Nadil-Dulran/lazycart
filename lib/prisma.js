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
const adapter = new PrismaNeon({ connectionString });

// Prefer adapter on Edge or Neon; else use Accelerate URL if provided; else force binary engine
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
let clientOptions = {};

if (process.env.NEXT_RUNTIME === 'edge' || isNeon) {
	clientOptions = { adapter };
} else if (accelerateUrl) {
	clientOptions = { accelerateUrl };
} else {
	clientOptions = { engine: { type: 'binary' } };
}

const prisma = global.prisma || new PrismaClient(clientOptions);

if (process.env.NEXT_RUNTIME !== 'edge') global.prisma = prisma;

export default prisma;