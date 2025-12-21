import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {
    try{
        const { userId, has} = getAuth(request)
        if(!userId){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { addressId, items, couponCode, paymentMethod } = await request.json()

        // Check required fields are present
        if (!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Ckech coupon
        let coupon = null
        if(couponCode){
                   coupon = await prisma.coupon.findUnique({
            where: {code: couponCode}
        })
        if(!coupon){
            return NextResponse.json({error: 'Coupon not found'}, {status: 400})
        }
        }



        if(coupon.forNewUser){
            const userorders = await prisma.order.findMany({
                where: {
                    userId: userId
                }
            })
            if(userorders.length > 0){
                return NextResponse.json({error: 'Coupon valid for new users only'}, {status: 400})
            }
        }

        if (coupon.forMember){
            const hasPlusPlan = has({plan: 'plus'})
            if(!hasPlusPlan){
                return NextResponse.json({error: 'Coupon valid for Members only'}, {status: 400})
            }
        }
    }catch(error){
        console.log('[ORDERS_POST]', error);
        return new NextResponse('Internal error', { status: 500 })
    }
}