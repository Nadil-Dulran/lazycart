import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



// Create the store
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        // Get the data from form
        const formData = await request.formData()

        const name = formData.get('name')
        const username = formData.get('username')
        const description = formData.get('description')
        const email = formData.get('email')
        const contact = formData.get('contact')
        const address = formData.get('address')
        const image = formData.get('image')

        // Validate the data 
        if(!name || !username || !description || !email || !contact || !address){
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if the user already has a store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })

        // If the user already has a store, return an error
        if(store){
            return NextResponse.json({ status: store.status })
        }

        // Check if the username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase()
            }
        })

        if(isUsernameTaken){
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
        }

        // Prepare a safe default logo (inline SVG) in case upload fails or image missing
        const defaultLogo = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">` +
            `<rect width="100%" height="100%" fill="#e2e8f0"/>` +
            `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="24" font-family="Arial, Helvetica, sans-serif">Store Logo</text>` +
            `</svg>`
        )

        let optimizedImage = defaultLogo
        // Attempt image upload to ImageKit only if an image was provided
        if (image && typeof image.arrayBuffer === 'function' && image.name) {
            try {
                const buffer = Buffer.from(await image.arrayBuffer());
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: image.name,
                    folder: "logos"
                })

                optimizedImage = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: "auto" },
                        { format: "webp" },
                        { width: "512" }
                    ]
                })
            } catch (uploadErr) {
                // Log and fall back to default inline logo, do not block store creation
                console.error('Image upload failed:', uploadErr)
                optimizedImage = process.env.DEFAULT_STORE_LOGO_URL || defaultLogo
            }
        }

        const newStore = await prisma.store.create({
            data: {
                userId,
                name, 
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage
            }
        })

        // Link store to user
        await prisma.user.update({
            where: {id: userId},
            data: { store: {connect: {id: newStore.id }} }
        })

        return NextResponse.json({ message: "Applied, wait for approval"})


    }catch(error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })

    }
}

// Check is user have already registered a store if yes then send status of store

export async function GET(request) {
    try{
        const { userId } = getAuth(request)

         // Check if the user already has a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })

        // If the user already has a store, return an error
        if(store){
            return NextResponse.json({ status: store.status })
        }

        return NextResponse.json({ status: "Not Registered"})

    }catch(error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })
    }
}