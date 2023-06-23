import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mapId = req.query.mapId as string

  if (req.method === 'GET') {
    // GET /api/maps/:mapId
    const map = await prisma.map.findUnique({
      where: {
        id: mapId
      }
    })

    if (map) {
      res.json(map)
    } else {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
    }
  } else if (req.method === 'POST') {
    // POST /api/maps/:mapId
    const newMap = req.body

    const createdMap = await prisma.map.create({
      data: newMap
    })

    res.status(201).json(createdMap)
  } else {
    // Unsupported HTTP method
    res.status(405).end()
  }
}
