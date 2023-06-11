import dynamic from 'next/dynamic';
import { MouseEventHandler, useState } from 'react';
import { ExtendFeature, FeatureCollection } from '../interfaces';

const DynamicMapComponent = dynamic(
  () => import('../components/MapComponent'),
  { ssr: false }
);

const Home = () => {
  const [text, setText] = useState('');
  const [geoJson, setGeoJson] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [{
    "type": "Feature",
    "properties": {
        "name": "ロンドン法科大学への入学",
        "year": 1888,
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Gandhi_student.jpg"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [
            -0.116600,
            51.523767
        ]
    }
}] });
  const [activeFeature, setActiveFeature] = useState<ExtendFeature | null>(null);

  const debug = (event: MouseEventHandler<HTMLButtonElement>) => {
    setGeoJson(prevGeoJson => ({
      ...prevGeoJson,
      features: [...prevGeoJson.features, {
        "type": "Feature",
        "properties": {
            "name": "Random",
            "year": 1888,
            "image": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Gandhi_student.jpg"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                Math.random() * 0.1 - 0.05,
                Math.random() * 0.1 - 0.05
            ]
        }
    }],
    }));
  };

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
      setText('');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <DynamicMapComponent geoJson={geoJson} activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      <button
        style={
          {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1500,
          }
        }
        onClick={debug}
      >debug</button>
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
