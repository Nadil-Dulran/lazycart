import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// Get store info & store products
export async function GET(request) {
    try{
        // Get store username from query params
        const { searchParams } = new URL(request.url)
        const rawUsername = searchParams.get('username')
        if(!rawUsername){
            return NextResponse.json({ error: 'Missing details: username' }, { status: 400 });
        }
        const username = rawUsername;
        
        // Get store info & instock products with ratings
        const store = await prisma.store.findFirst({
            where: { 
                username: { equals: username, mode: 'insensitive' },
                isActive: true 
            },
            include: {
                Product: {
                    where: { inStock: true },
                    include: { rating: true }
                }
            }
        })
        if(!store){
            // Fallback: check if store exists but is inactive
            const existingStore = await prisma.store.findFirst({
                where: { username: { equals: username, mode: 'insensitive' } }
            })
            if(existingStore && existingStore.isActive === false){
                return NextResponse.json({ error: 'Store is inactive' }, { status: 403 })
            }
            return NextResponse.json({ error: 'Store not found' }, { status: 400 })
        }
        // Map relation name to `products` for client expectations
        const { Product, ...storeInfo } = store
        return NextResponse.json({ store: { ...storeInfo, products: Product } })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })

    }
}