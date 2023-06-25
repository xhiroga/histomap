import { STFeature } from "../interfaces"
import { e2f } from "./e2f"
import edtf from "edtf"

export const filterFeaturesByNumericDateTimes = (features: STFeature[], range: number[]): STFeature[] => {
  return features.filter((feature) => {
    try {
      const numericDateTime = edtf(feature.properties.edtf).min
      return range[0] <= numericDateTime && numericDateTime <= range[1]
    } catch (e) {
      return true // Falseで非表示にすると、人間が手動でエラーを訂正する機会が無くなってしまうため
    }
  })
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('filterFeaturesByNumericDateTimes', () => {
    const ad1950 = e2f("1950")
    const ad1960_01_01 = e2f("1960-01-01")
    const ad1970_01_01 = e2f("1970-01-01")
    const range = [-631152000000, -315619200000]
    expect(filterFeaturesByNumericDateTimes([ad1950, ad1960_01_01, ad1970_01_01], range)).toEqual([ad1950, ad1960_01_01])
  })
}


