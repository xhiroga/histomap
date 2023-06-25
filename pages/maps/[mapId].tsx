import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import EditorComponent from '../../components/EditorComponent';
import { STFeature, STMap } from '../../interfaces';
import { deleteFeatureInMap } from '../../utils/deleteFeaturesInMap';
import { updateFeaturesInMap } from '../../utils/updateFeaturesInMap';


Modal.setAppElement('#__next'); // Avoid Modal warning

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

  // Optimistic UI Update（楽観的UIアップデート）の考え方で実装している。
  // TODO: 思いつきでやってみたので、UX向上とコードの複雑性の釣り合いが取れているか検証する。
  const updateFeature = async (feature: STFeature) => {
    if (!map) {
      return;
    }

    const clientUpdatedMap = updateFeaturesInMap(map, [feature]);
    setMap(clientUpdatedMap);

    const response = await fetch(`/api/maps/${map.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'updateFeature', payload: { feature } }),
    });
    const serverUpdatedMap = await response.json();
    setMap(serverUpdatedMap);
  }

  const deleteFeature = async (id: string) => {
    if (!map) {
      return;
    }

    const clientUpdatedMap = deleteFeatureInMap(map, id);
    setMap(clientUpdatedMap);
    const response = await fetch(`/api/maps/${map.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteFeature', payload: { id } }),
    });
    const serverUpdatedMap = await response.json();
    setMap(serverUpdatedMap);
  }

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
        body: JSON.stringify({ action: "generateFeatures", payload: { text } }),
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
      <Modal
        isOpen={activeFeature !== null}
        onRequestClose={() => setActiveFeature(null)}
        contentLabel="Feature Edit Modal"
        style={{
          overlay: {
            zIndex: 1500,
          },
        }}
      >
        {activeFeature && <EditorComponent activeFeature={activeFeature} setActiveFeature={setActiveFeature} updateFeature={updateFeature} />}
      </Modal>
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
