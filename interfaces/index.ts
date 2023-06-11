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
