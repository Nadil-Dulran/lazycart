import { getAuth } from "@clerk/nextjs/server"


// Update user cart
export async function POST(request) {
    try{
        const {userId} = getAuth(request)
        const {cart} = await request.json()


        
        }catch(error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })
    }
    
}