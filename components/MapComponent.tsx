import L, { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { STFeature, STFeatureCollection, STMap } from '../interfaces';
import FeatureModalComponent from './FeatureModalComponent';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

interface MapComponentProps {
  map: STMap;
  setMap: (map: STMap) => void;
  activeFeature: STFeature | null;
  setActiveFeature: (feature: STFeature | null) => void;
}

const pointToLayer = (feature, latlng) => {
  const customIcon = new L.DivIcon({
    html: `
      <div class="bg-[#4DA9BE] rounded-full w-2 h-2"></div>
      <div class="bg-white rounded-lg p-2 shadow-lg w-36">
        <h2 class="font-bold text-base mb-1 truncate">${feature.properties.name}</h2>
        <p class="text-sm mb-1 truncate">${feature.properties.edtf}</p>
      </div>
    `,
    className: '',  // 指定しないとデフォルトの `leaflet-div-icon` が指定され、"background: #fff; border: 1px solid #666;" が適用される
  })

  // カスタムアイコンを使用して新しいマーカーを作成します
  const marker = L.marker(latlng, { icon: customIcon });

  return marker;
}

interface GeoJSONComponentProps {
  data: STFeatureCollection;
  setActiveFeature: (feature: STFeature | null) => void;
}

const GeoJSONComponent = ({ data, setActiveFeature }: GeoJSONComponentProps) => {
  // TODO: Fit bounds to geoJson
  return (
    <GeoJsonWithUpdates
      data={data}
      onEachFeature={(feature, layer) => {
        layer.on({ click: () => setActiveFeature(feature as STFeature) });
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
