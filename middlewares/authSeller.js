import prisma from "@/lib/prisma";

const authSeller = async (userId) => {
    try {
        if (!userId) return false;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { store: true },
        });

        if (!user || !user.store) return false;
        // Status values are lowercase per schema/admin routes: 'approved' | 'pending' | 'rejected'
        return user.store.status === "approved" ? user.store.id : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default authSeller;