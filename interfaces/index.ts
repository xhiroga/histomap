export interface ExtendedFeatureCollection {
  type: "FeatureCollection",
  features: ExtendedFeature[]
}

export interface ExtendedFeature extends GeoJSON.Feature {
  properties: {
    id: string;
    name: string;
    edtf: string;
    image: string;
  };
}
