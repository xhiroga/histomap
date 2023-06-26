// Spatiotemporal Map
// MapはTypeScriptの予約語なのでSTMapsにしている。
export interface STMap {
  id: string;
  name: string;
  featureCollection: STFeatureCollection;
}

export interface STFeatureCollection {
  type: "FeatureCollection";
  features: STFeature[]
}

// GeoJSON.Feature を拡張すると、Prismaでgeometryの柔軟な型を定義することになってしまう。
export interface STFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    edtf: string;
    description: string;
  };
  geometry: {
    type: "Point";
    coordinates: number[];
  };
}
