import edtf from 'edtf';
import { STFeature } from "../interfaces";
import { e2f } from './e2f';

// TODO: Intervalに対応する。
export const featuresToNumericDateTimes = (features: STFeature[]): number[] => {
  return features
    .map((feature) => {
      try {
        return edtf(feature.properties.edtf).min
      } catch (error) {
        console.error("Invalid EDTF:", feature.properties.edtf)
        return null
      }
    })
    .filter((edtf) => edtf !== null)
    .sort((a, b) => a - b)
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('featuresToNumericDateTimes', () => {
    expect(featuresToNumericDateTimes([e2f("2021-01-01")])).toEqual([1609459200000])  // Normal
    expect(featuresToNumericDateTimes([e2f("1970-01-01"), e2f("1960-01-01"), e2f("1950")])).toEqual([-631152000000, -315619200000, 0]) // Negative, Year only ,Sort
  })
}
