import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {
    try{
        const { userId, has} = getAuth(request)
        if(!userId){
            return NextResponse
        }
    }catch(error){
        console.log('[ORDERS_POST]', error);
        return new NextResponse('Internal error', { status: 500 })
    }
}