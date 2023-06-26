import { STFeature } from "../interfaces";

export const e2f = (edtf: string): STFeature => ({
  type: "Feature",
  properties: {
    id: "",
    name: "",
    edtf,
    description: "",
  },
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
})
