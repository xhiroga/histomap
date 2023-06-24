import L, { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ExtendedFeature, ExtendedFeatureCollection, STMap } from '../interfaces';
import FeatureModalComponent from './FeatureModalComponent';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

interface MapComponentProps {
  map: STMap;
  setMap: (map: STMap) => void;
  activeFeature: ExtendedFeature | null;
  setActiveFeature: (feature: ExtendedFeature | null) => void;
}

const pointToLayer = (feature, latlng) => {
  const defaultIconUrl = '/search.svg';

  // 特徴のプロパティからアイコンのURLを取得し、存在しない場合はデフォルトのURLを使用します
  const iconUrl = feature.properties.image || defaultIconUrl;

  // カスタムアイコンを作成します
  const customIcon = new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // カスタムアイコンを使用して新しいマーカーを作成します
  const marker = L.marker(latlng, { icon: customIcon });

  // マーカーにポップアップを追加します
  marker.bindPopup(
    `<div>
        <h2>${feature.properties.name}</h2>
        <img src="${feature.properties.image}" alt="${feature.properties.name}" />
        <p>${feature.properties.edtf}</p>
      </div>`
  );

  return marker;
}

interface GeoJSONComponentProps {
  data: ExtendedFeatureCollection;
  setActiveFeature: (feature: ExtendedFeature | null) => void;
}

const GeoJSONComponent = ({ data, setActiveFeature }: GeoJSONComponentProps) => {
  // TODO: Fit bounds to geoJson
  return (
    <GeoJsonWithUpdates
      data={data}
      onEachFeature={(feature, layer) => {
        layer.on({ click: () => setActiveFeature(feature) });
      }}
      pointToLayer={pointToLayer}
    />
  );
}

const MapComponent = ({ map, setMap, setActiveFeature, activeFeature }: MapComponentProps) => {
  const position: LatLngTuple = [51.505, -0.09];

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      zoom={3}
      center={position}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONComponent data={map.featureCollection} setActiveFeature={setActiveFeature} />
      <FeatureModalComponent
        map={map}
        setMap={setMap}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />
    </MapContainer>
  );
};

export default MapComponent;
