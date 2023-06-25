import edtf from 'edtf';
import { STFeature } from "../interfaces";

// TODO: Intervalに対応する。
export const featuresToNumericDateTimes = (features: STFeature[]): number[] => {
  return features.map((feature) => edtf(feature.properties.edtf).min).sort((a, b) => a - b)
}

const f = (edtf: string): STFeature => ({
  type: "Feature",
  properties: {
    id: "",
    name: "",
    edtf,
  },
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
})

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('featuresToNumericDateTimes', () => {
    expect(featuresToNumericDateTimes([f("2021-01-01")])).toEqual([1609459200000])  // Normal
    expect(featuresToNumericDateTimes([f("1970-01-01"), f("1960-01-01"), f("1950")])).toEqual([-631152000000, -315619200000, 0]) // Negative, Year only ,Sort
  })
}
