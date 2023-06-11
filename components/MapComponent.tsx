import { LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ExtendFeature, FeatureCollection } from '../interfaces';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

interface MapComponentProps {
  geoJson: FeatureCollection;
  setActiveFeature: (feature: ExtendFeature | null) => void;
  activeFeature: ExtendFeature | null;
}

interface GeoJSONComponentProps {
  data: FeatureCollection;
  setActiveFeature: (feature: ExtendFeature | null) => void;
}

const GeoJSONComponent = ({ data, setActiveFeature }: GeoJSONComponentProps) => {
  // TODO: Fit bounds to geoJson
  return (
    <GeoJsonWithUpdates data={data} onEachFeature={(feature, layer) => {
      layer.on({ click: () => setActiveFeature(feature) });
    }} />
  );
}

const MapComponent = ({ geoJson, setActiveFeature, activeFeature }: MapComponentProps) => {
  const position: LatLngTuple = [51.505, -0.09];

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      zoom={13}
      center={position}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONComponent data={geoJson} setActiveFeature={setActiveFeature}/>
      {activeFeature && (
        <Marker position={activeFeature.geometry.coordinates}>
          <Popup>
            <div>
              <h2>{activeFeature.properties.name}</h2>
              <img src={activeFeature.properties.image} alt={activeFeature.properties.name} />
              <p>{activeFeature.properties.year}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
