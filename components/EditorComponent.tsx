import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import edtf from 'edtf';
import { useCallback, useEffect, useState } from "react";
import { STFeature } from "../interfaces";
interface EditorComponentProps {
  activeFeature: STFeature;
  setActiveFeature: (feature: STFeature | null) => void;
  updateFeature: (feature: STFeature) => void;
  deleteFeature: (id: string) => void;
}

const EditorComponent = ({ activeFeature, setActiveFeature, updateFeature, deleteFeature }: EditorComponentProps) => {
  const [edtfValue, setEdtfValue] = useState(activeFeature.properties.edtf);
  const [isError, setIsError] = useState(false);


  const validateEdtf = useCallback((value) => {
    try {
      edtf.parse(value);  // If this throws an error, the input is not valid
      setIsError(false);
    } catch (e) {
      setIsError(true);
    }
  }, [setIsError]);

  useEffect(() => {
    validateEdtf(edtfValue);
  }, [validateEdtf, edtfValue]);

  const handleEdtfChange = (event) => {
    const value = event.target.value;
    validateEdtf(value);
    setEdtfValue(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, edtf, long, lat, description } = Object.fromEntries(formData.entries());

    let geometry: STFeature['geometry'];
    if (activeFeature.geometry.type === 'Point') {
      geometry = {
        ...activeFeature.geometry,
        coordinates: [
          typeof long === 'string' ? parseFloat(long) : activeFeature.geometry.coordinates[0],
          typeof lat === 'string' ? parseFloat(lat) : activeFeature.geometry.coordinates[1],
        ],
      };
    } else {
      geometry = activeFeature.geometry;
    }

    const newFeature = {
      ...activeFeature,
      properties: {
        ...activeFeature.properties,
        name: typeof name === 'string' ? name : activeFeature.properties.name,
        edtf: typeof edtf === 'string' ? edtf : activeFeature.properties.edtf,
        description: typeof description === 'string' ? description : activeFeature.properties.description,
      },
      geometry,
    };
    console.debug({ newFeature });
    updateFeature(newFeature);
  };

  const deleteThis = () => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      setActiveFeature(null);
      deleteFeature(activeFeature.properties.id);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      p={2}
      sx={{
        backgroundColor: 'white',
        overflow: 'auto', // Add this
      }}>
      <Box mb={2}>
        <TextField
          label="Name"
          name="name"
          defaultValue={activeFeature.properties.name}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="EDTF"
          name="edtf"
          value={edtfValue}
          onChange={handleEdtfChange}
          error={isError}
          helperText={isError ? "Invalid EDTF format" : ""}
        />
      </Box>
      {
        // geometry.coordinates が number[] の場合に、Pointとして扱って表示する。それ以外、例えば number[][][] の場合は、いまはサポート対象外とする。
        activeFeature.geometry.type === 'Point' && (<>
          <Box mb={2}>
            <TextField
              label="long"
              name="long"
              defaultValue={activeFeature.geometry.coordinates[0]}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="lat"
              name="lat"
              defaultValue={activeFeature.geometry.coordinates[1]}
            />
          </Box>
        </>)
      }
      <Box mb={2}>
        <TextField
          label="description"
          name="description"
          multiline
          variant="outlined"
          minRows={8}
          fullWidth
          defaultValue={activeFeature.properties.description}
        />
      </Box>
      <Box>
        <Button variant="contained" onClick={deleteThis}>Delete</Button>
        <Button variant="contained" type="submit">Save</Button>
      </Box>
    </Box>
  )
}

export default EditorComponent;
