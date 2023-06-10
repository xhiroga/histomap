import { GetServerSideProps } from 'next';
// import Papa from 'papaparse';
import dynamic from 'next/dynamic';
import { Feature } from '../types/geojson';
import { geoJson } from '../utils/sample-data';


// No SSR for Map component
const DynamicMapComponent = dynamic(
  () => import('../components/MapComponent'),
  { ssr: false }
);


interface HomeProps {
  geoJson: Feature[];
}

const Home = ({ geoJson }: HomeProps) => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DynamicMapComponent geoJson={geoJson} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      geoJson,
    },
  };
};

export default Home;
