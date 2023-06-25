import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { textToFeatures } from '../../../utils/textToGeoJson'
import { STFeature, STMap } from '../../../interfaces'
import { updateFeaturesInMap } from '../../../utils/updateFeaturesInMap'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mapId = req.query.mapId as string
  console.debug({ mapId, query: req.query, body: req.body, method: req.method })

  if (req.method === 'GET') {
    const map = await getMap(mapId)
    if (!map) {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
      return
    }
    res.json(map)
  } else if (req.method === 'PATCH') {
    const map = await getMap(mapId)
    if (!map) {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
      return
    }

    let features: STFeature[] | undefined
    const { feature, text } = req.body
    if (feature) {
      features = [feature]
    } else if (text) {
      features = await textToFeatures(text)
    } else {
      res.status(400).json({ error: 'Request body is invalid.' })
      return
    }
    if (!features) {
      res.status(400).json({ error: 'AI cannot parse text as features.' })
      return
    }
    const patchedMapReq = updateFeaturesInMap(map, features)

    const patchedMapRes = await prisma.sTMaps.update({
      where: {
        id: mapId
      },
      data: {
        featureCollection: patchedMapReq.featureCollection,
      }
    })
    res.status(200).json(patchedMapRes);
    return
  } else {
    // Unsupported HTTP method
    res.status(405).end()
    return
  }
}

const getMap = async (mapId: string) => {
  const map = await prisma.sTMaps.findUnique({
    where: {
      id: mapId
    }
  })
  return map as STMap // TODO: なんとかする
}
