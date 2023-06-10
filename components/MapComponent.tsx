import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Feature } from '../types/geojson';
import { LatLngTuple } from 'leaflet';

// const getGeoJsonFromSpreadsheet = async () => {
//   const spreadsheetUrl = 'YOUR_SPREADSHEET_PUBLISHED_CSV_URL';

//   const response = await fetch(spreadsheetUrl);
//   const csvData = await response.text();

//   const data = Papa.parse(csvData, { header: true }).data;

//   // GeoJSON形式にデータを変換
//   const geoJson: Feature[] = data.map((item: any) => ({
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [Number(item.longitude), Number(item.latitude)],
//     },
//     properties: {
//       name: item.name,
//       year: item.year,
//     },
//   }));

//   return geoJson;
// }

interface MapComponentProps {
  geoJson: Feature[];
}

const MapComponent = ({ geoJson }: MapComponentProps) => {
  const [map, setMap] = useState(null);

  const position: LatLngTuple = [51.505, -0.09];

  useEffect(() => {
    if (!map) return;
    const bounds = geoJson.map(feature => feature.geometry.coordinates);
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
