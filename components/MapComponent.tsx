import L, { LatLng, LatLngTuple } from 'leaflet';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { STFeature, STFeatureCollection, STMap } from '../interfaces';
import { featuresToNumericDateTimes } from '../utils/featuresToNumericDateTimes';
import { filterFeaturesByNumericDateTimes } from '../utils/filterFeaturesByNumericDateTimes';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';
import VerticalRangeSliderComponent from './VerticalRangeSliderComponent';

interface MapComponentProps {
  map: STMap;
  setActiveFeature: (feature: STFeature | null) => void;
}

const pointToLayer = (feature: STFeature, latlng: LatLng) => {
  const dotSize = 0.5;
  const fukidashiWidth = 9;
  const customIcon = new L.DivIcon({
    html: `
    <div style="background-color: #FF9900; border-radius: 50%; width: ${dotSize}rem; height: ${dotSize}rem; margin-left: ${-dotSize / 2}rem;"></div>
    <div style="align-items:center; display: flex; flex-direction: column; width: fit-content; margin-left: ${-fukidashiWidth / 2}rem;">
      <div style="margin-top: -12px; border: 12px solid transparent; border-bottom: 10px solid #fff;"></div>
      <div style="background-color: white; border-radius: 0.5rem; padding: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); width: ${fukidashiWidth}rem;">
        <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${feature.properties.name}</div>
        <div style="font-size: 0.875rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${feature.properties.edtf}</div>
        <div style="font-size: 0.875rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${feature.properties.description}</div>
      </div>
    </div>
    `,
    className: '',  // 指定しないとデフォルトの `leaflet-div-icon` が指定され、"background: #fff; border: 1px solid #666;" が適用される
  })
  return L.marker(latlng, { icon: customIcon });
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

const MapComponent = ({ map, setActiveFeature }: MapComponentProps) => {
  const values = featuresToNumericDateTimes(map.featureCollection.features);
  const min = values[0];
  const max = values[values.length - 1];
  const [range, setRange] = useState([min, max]);
  const filteredFeatures = filterFeaturesByNumericDateTimes(map.featureCollection.features, range);
  const filteredFeatureCollection: STFeatureCollection = {
    ...map.featureCollection,
    features: filteredFeatures,
  };

  const position: LatLngTuple = [51.505, -0.09];

  return (
    <>
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        zoom={3}
        center={position}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSONComponent data={filteredFeatureCollection} setActiveFeature={setActiveFeature} />
      </MapContainer>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1500,
      }}>
        {/* TODO: スライダーのタッチ中のエフェクト調整含め、もう少し右に寄せて画面のスペースを確保する */}
        <div style={{
          marginTop: '2rem',
          marginRight: '1rem',
        }}>
          <VerticalRangeSliderComponent range={range} setRange={setRange} values={values} min={min} max={max} />
        </div>
      </div>
    </>
  );
};

export default MapComponent;
