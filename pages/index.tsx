import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { FeatureCollection } from '../interfaces';

const DynamicMapComponent = dynamic(
  () => import('../components/MapComponent'),
  { ssr: false }
);

const Home = () => {
  const [text, setText] = useState('');
  const [geoJson, setGeoJson] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] });
  const [messages, setMessages] = useState<string[]>([]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();

      const response = await fetch('/api/handleText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const newFeatures = await response.json(); // APIから返ってくる新しいGeoJSONフィーチャー
      console.log({newFeatures})

      setGeoJson(prevGeoJson => ({
        ...prevGeoJson,
        features: [...prevGeoJson.features, ...newFeatures],
      }));

      setMessages(prevMessages => [...prevMessages, text]);
      setText('');
    }
  };

  useEffect(() => {
    console.log({messages});
  }, [messages]);

  useEffect(() => {
    console.log({geoJson});
  }, [geoJson]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <DynamicMapComponent geoJson={geoJson} />
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress}
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

export default Home;
