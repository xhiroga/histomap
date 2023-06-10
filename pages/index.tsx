import { GetServerSideProps } from 'next';
// import Papa from 'papaparse';
import { geoJson } from '../utils/sample-data';
import Layout from '../components/Layout';
import Link from 'next/link';

interface Feature {
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      geoJson,
    },
  };
};

const Home = ({ geoJson }: { geoJson: Feature[] }) => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">About</Link>
      </p>
    </Layout>
  );
};

export default Home;
