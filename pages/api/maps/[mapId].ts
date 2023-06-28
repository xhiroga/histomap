import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { STFeature, STMap } from '../../../interfaces'
import { deleteFeatureInMap } from '../../../utils/deleteFeatureInMap'
import { textToFeatures } from '../../../utils/textToGeoJson'
import { updateFeaturesInMap } from '../../../utils/updateFeaturesInMap'


type PatchMapRequest = {
  action: 'generateFeatures'
  payload: { text: string }
} | {
  action: 'createFeature'
  payload: { feature: STFeature }
} | {
  action: 'updateFeature'
  payload: { feature: STFeature }
} | {
  action: 'deleteFeature'
  payload: { id: string }
}

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
    // STMapの型は今後変更する可能性があるので、API設計に柔軟性を持たせるためにCommand Patternで実装する
    const { action, payload } = req.body as PatchMapRequest // TODO: Validation
    if (!action || !payload) {
      res.status(400).json({ error: 'Request body is invalid.' })
      return
    }

    const map = await getMap(mapId)
    if (!map) {
      res.status(404).json({ error: `Map with id ${mapId} not found.` })
      return
    }

    // TODO: Refactor
    let patchedMapReq: STMap
    if (action === 'generateFeatures' || action === 'createFeature' || action === 'updateFeature') {
      let features: STFeature[] | undefined
      if (action === 'generateFeatures') {
        features = await textToFeatures(payload.text)
        if (!features) {
          res.status(400).json({ error: 'AI cannot parse text as features.' })
          return
        }
      } else if (action === 'createFeature' || action === 'updateFeature') {
        features = [payload.feature]
      } else {
        res.status(400).json({ error: 'Request body is invalid.' })
        return
      }
      patchedMapReq = updateFeaturesInMap(map, features)
    } else if (action === 'deleteFeature') {
      patchedMapReq = deleteFeatureInMap(map, payload.id)
    } else {
      res.status(400).json({ error: 'Request body is invalid.' })
      return
    }

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
