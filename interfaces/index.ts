export interface FeatureCollection {
  type: "FeatureCollection",
  features: ExtendFeature[]
}

export interface ExtendFeature extends GeoJSON.Feature {
  properties: {
    name: string;
    year: number;
    image: string;
  };
}
