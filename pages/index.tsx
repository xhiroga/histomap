import { GetServerSideProps } from 'next';
// import Papa from 'papaparse';
import dynamic from 'next/dynamic';
import { Feature } from '../types/geojson';
import { geoJson } from '../utils/sample-data';
import { useState, KeyboardEvent, useEffect } from 'react';


// No SSR for Map component
const DynamicMapComponent = dynamic(
  () => import('../components/MapComponent'),
  { ssr: false }
);


interface HomeProps {
  geoJson: Feature[];
}

const Home = ({ geoJson }: HomeProps) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setMessages(prevMessages => [...prevMessages, text]);
      setText('');
    }
  };
  useEffect(() => {
    console.log({messages})
  }, [messages]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <DynamicMapComponent geoJson={geoJson} />
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress}
        placeholder="Type your message here..."
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100px",
          zIndex: 1001,  // Leafletのz-indexが1000なので、それより大きな値を指定
          opacity: "0.6",
          backgroundColor: "white"
        }}
      />
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
