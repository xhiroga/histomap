import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const maps = await prisma.map.findMany();
            res.status(200).json(maps);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving map data.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
