// Spatiotemporal Map
// MapはTypeScriptの予約語なのでSTMapsにしている。
export interface STMap {
  id: string;
  name: string;
  featureCollection: STFeatureCollection;
}

export interface STFeatureCollection {
  type: "FeatureCollection",
  features: STFeature[]
}

export interface STFeature extends GeoJSON.Feature {
  properties: {
    id: string;
    name: string;
    edtf: string;
  };
}
