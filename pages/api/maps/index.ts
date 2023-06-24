import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const maps = await prisma.sTMaps.findMany();
      res.status(200).json(maps);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving map data.' });
    }
  } else if (req.method === 'POST') {
    // POST /api/maps/:mapId
    const newMap = req.body

    const createdMap = await prisma.sTMaps.create({
      data: newMap
    })

    res.status(201).json(createdMap)
  }
  else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
