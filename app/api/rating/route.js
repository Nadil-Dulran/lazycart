import { useAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Add new rating
export async function POST(request) {
    try {
        const { userId } = useAuth(request)
    }catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}