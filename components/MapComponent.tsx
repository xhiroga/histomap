import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ExtendedFeature, ExtendedFeatureCollection } from '../interfaces';
import FeatureModalComponent from './FeatureModalComponent';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

interface MapComponentProps {
  geoJson: ExtendedFeatureCollection;
  setGeoJson: (geoJson: ExtendedFeatureCollection) => void;
  activeFeature: ExtendedFeature | null;
  setActiveFeature: (feature: ExtendedFeature | null) => void;
}

interface GeoJSONComponentProps {
  data: ExtendedFeatureCollection;
  setActiveFeature: (feature: ExtendedFeature | null) => void;
}

const GeoJSONComponent = ({ data, setActiveFeature }: GeoJSONComponentProps) => {
  // TODO: Fit bounds to geoJson
  return (
    <GeoJsonWithUpdates data={data} onEachFeature={(feature, layer) => {
      layer.on({ click: () => setActiveFeature(feature) });
    }} />
  );
}

const MapComponent = ({ geoJson, setGeoJson, setActiveFeature, activeFeature }: MapComponentProps) => {
  const position: LatLngTuple = [51.505, -0.09];

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      zoom={5}
      center={position}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONComponent data={geoJson} setActiveFeature={setActiveFeature} />
      <FeatureModalComponent
        geoJson={geoJson}
        setGeoJson={setGeoJson}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />
    </MapContainer>
  );
};

export default MapComponent;
