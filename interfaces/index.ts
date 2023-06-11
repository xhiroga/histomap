export interface FeatureCollection {
  type: "FeatureCollection",
  features: Feature[]
}

export interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    year: string;
  };
}
