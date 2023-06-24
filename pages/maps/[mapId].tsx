import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { STFeature, STMap } from '../../interfaces';

const DynamicMapComponent = dynamic(
  () => import('../../components/MapComponent'),
  { ssr: false }
);

interface MapPageProps {
  mapId: string;
}

const MapPage: React.FC<MapPageProps> = ({ mapId }) => {
  const [map, setMap] = useState<STMap | null>(null);
  const [activeFeature, setActiveFeature] = useState<STFeature | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(`/api/maps/${mapId}`);
        const data = await response.json();
        setMap(data);
      } catch (error) {
        console.error("An error occurred while fetching map data: ", error);
      }
    };

    fetchMapData();
  }, [mapId]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!map) {
      return;
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();

      const response = await fetch(`/api/maps/${map.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const patchedMap = await response.json();
      console.log({ patchedMap })

      const lastFeature = patchedMap.featureCollection.features[patchedMap.featureCollection.features.length - 1];

      setMap(patchedMap);
      setActiveFeature(lastFeature);
      setText('');
    }
  };

  if (!map) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <DynamicMapComponent map={map} setMap={setMap} activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      <textarea
        className='text-base'
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '100px',
          zIndex: 1500,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mapId = context.params?.mapId;

  if (typeof mapId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      mapId,
    },
  };
};

export default MapPage;
