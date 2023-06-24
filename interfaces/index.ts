// Spatiotemporal Map
// MapはTypeScriptの予約語なのでSTMapsにしている。
export interface STMap {
  id: string;
  name: string;
  featureCollection: ExtendedFeatureCollection;
}

export interface ExtendedFeatureCollection {
  type: "FeatureCollection",
  features: ExtendedFeature[]
}

export interface ExtendedFeature extends GeoJSON.Feature {
  properties: {
    id: string;
    name: string;
    edtf: string;
  };
}
