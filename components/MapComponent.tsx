import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import { LatLngTuple } from 'leaflet';
import { FeatureCollection } from '../interfaces';

interface MapComponentProps {
  geoJson: FeatureCollection;
}

const MapComponent = ({ geoJson }: MapComponentProps) => {
  console.log({ geoJson })
  const [map, setMap] = useState(null);

  const position: LatLngTuple = [51.505, -0.09];

  useEffect(() => {
    if (!map) return;
    const bounds = geoJson.features.map(feature => feature.geometry.coordinates);
    map.fitBounds(bounds);
  }, [map]);

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      whenCreated={setMap}
      zoom={13}
      center={position}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoJson} />
    </MapContainer>
  );
};

export default MapComponent;
