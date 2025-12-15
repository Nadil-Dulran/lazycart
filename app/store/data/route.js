



// Get store info & store products
export async function GET(request) {
    try{
        // Get store username from query params
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username').toLowerCase();

        if(!username){
            return NextResponse.json({ error: 'Missing details: username' }, { status: 400 });
        }
        
        // Get store info & instock products with ratings
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 })

    }
}