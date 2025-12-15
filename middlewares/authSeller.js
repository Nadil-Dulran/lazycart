import prisma from "@/lib/prisma";

const authSeller = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { store: true },
        });

        if (!user || !user.store) return false;
        return user.store.status === "APPROVED" ? user.store.id : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default authSeller;