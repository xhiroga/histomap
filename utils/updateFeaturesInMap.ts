import { STFeature, STMap } from "../interfaces";

export const updateFeaturesInMap = (map: STMap, newFeatures: STFeature[]): STMap => {
  // Merge newFeatures into map. If there is a feature with the same id, overwrite it. Otherwise, add it.
  const nonOverwrittenFeatures = map.featureCollection.features.filter(f => {
    return !newFeatures.some(nf => nf.properties.id === f.properties.id)
  })
  const updatedFeatures = [...nonOverwrittenFeatures, ...newFeatures]
  const updatedMap = {
    ...map,
    featureCollection: {
      ...map.featureCollection,
      features: updatedFeatures
    }
  }
  return updatedMap
}
