import prisma from "@/lib/prisma";


export async function GET(request) {
    try{
        let products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                rating: {
                select: {
                    createdAt: true, rating: true, review: true, user: { select: {name: true, image: true} }
                }
            },
            store: true
        },
        orderBy: { createdAt: 'desc' }   
    })

    // Remove products with store isActive false

    }catch(error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })
    }
    
}