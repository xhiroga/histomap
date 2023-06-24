import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { textToFeatures } from '../../../utils/textToGeoJson'
import { STFeature, STMap } from '../../../interfaces'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mapId = req.query.mapId as string
  console.debug({ mapId, query: req.query, body: req.body, method: req.method })

  if (req.method === 'GET') {
    const map = await getMap(mapId)
    if (!map) {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
    }
    res.json(map)
  } else if (req.method === 'PATCH') {
    const map = await getMap(mapId)
    if (!map) {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
    }

    const { text } = req.body
    if (!text) {
      res.status(400).json({ error: 'Request body must contain text.' })
      return
    }
    const features = await textToFeatures(text)
    if (!features) {
      res.status(400).json({ error: 'AI cannot parse text as features.' })
    }

    const patchedMapReq = mergeFeaturesToMap(features, map)

    const patchedMapRes = await prisma.sTMaps.update({
      where: {
        id: mapId
      },
      data: {
        featureCollection: patchedMapReq.featureCollection,
      }
    })
    res.status(200).json(patchedMapRes);
  } else {
    // Unsupported HTTP method
    res.status(405).end()
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

const mergeFeaturesToMap = (features: STFeature[], map: STMap): STMap => {
  const mergedFeatures = [...map.featureCollection.features, ...features]
  const mergedMap = {
    ...map,
    featureCollection: {
      ...map.featureCollection,
      features: mergedFeatures
    }
  }
  return mergedMap
}
