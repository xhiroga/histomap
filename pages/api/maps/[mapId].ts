import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mapId = req.query.mapId as string

  if (req.method === 'GET') {
    // GET /api/maps/:mapId
    const map = await prisma.sTMaps.findUnique({
      where: {
        id: mapId
      }
    })
    if (map) {
      res.json(map)
    } else {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
    }
  } else {
    // Unsupported HTTP method
    res.status(405).end()
  }
}
