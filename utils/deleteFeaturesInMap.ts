import { STMap } from "../interfaces";

export const deleteFeatureInMap = (map: STMap, id: string): STMap => {
  // Delete feature with id from map.
  const updatedMap = {
    ...map,
    featureCollection: {
      ...map.featureCollection,
      features: map.featureCollection.features.filter(f => f.properties.id !== id)
    }
  }
  return updatedMap
}
