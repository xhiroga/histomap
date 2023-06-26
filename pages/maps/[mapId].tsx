import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Drawer } from '@mui/material';
import ChatComponent from '../../components/ChatComponent';
import EditorComponent from '../../components/EditorComponent';
import { STFeature, STMap } from '../../interfaces';
import { deleteFeatureInMap } from '../../utils/deleteFeatureInMap';
import { updateFeaturesInMap } from '../../utils/updateFeaturesInMap';

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

    const response = await fetch(`/api/maps/${mapId}`, {
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
    const response = await fetch(`/api/maps/${mapId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteFeature', payload: { id } }),
    });
    const serverUpdatedMap = await response.json();
    setMap(serverUpdatedMap);
  }

  if (!map) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DynamicMapComponent map={map} setActiveFeature={setActiveFeature} />
      <ChatComponent mapId={mapId} setMap={setMap} setActiveFeature={setActiveFeature} />
      <Drawer
        anchor="bottom"
        open={activeFeature !== null}
        onClose={() => setActiveFeature(null)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgb(255 255 255 / 50%)',
            }
          }
        }}
        sx={{
          zIndex: 2000, // MUIのDrawerは他の要素を書き換えることでいい感じに表示してくれるが、Leafletと併用している関係でz-indexだけは指定しないとマウス入力がこちらに入ってこないようだ。
        }}
      >
        {activeFeature ? <EditorComponent activeFeature={activeFeature} setActiveFeature={setActiveFeature} updateFeature={updateFeature} deleteFeature={deleteFeature} /> : <></>}
      </Drawer>
    </>
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
