import SendIcon from '@mui/icons-material/Send';
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { STFeature, STMap } from "../interfaces";

interface ChatComponentProps {
  mapId: string;
  setMap: (map: STMap) => void;
  setActiveFeature: (feature: STFeature) => void;
}

const ChatComponent = ({ mapId, setMap, setActiveFeature }: ChatComponentProps) => {
  const [text, setText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const submit = async (): Promise<STMap | void> => {
    const response = await fetch(`/api/maps/${mapId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: "generateFeatures", payload: { text } }),
    });
    const patchedMap = await response.json();

    const lastFeature = patchedMap.featureCollection.features[patchedMap.featureCollection.features.length - 1];

    setMap(patchedMap);
    setActiveFeature(lastFeature);
    setText('');
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit();
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      await submit();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        bgcolor: 'background.paper',
        zIndex: 1500,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            padding: 1,
          }}
        >
          <TextField
            multiline
            maxRows={10}
            value={text}
            inputProps={{
              onChange: handleTextChange,
              onKeyDown: handleKeyDown, // inputProps側のonKeyDownを参照しないと型が異なる
            }}
            placeholder="Type your message here..."
            fullWidth
            variant="outlined"
          />
          <Box display={'flex'} height={56}>
            <Button
              disabled={!text}
              type="submit"
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default ChatComponent;
