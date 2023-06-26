import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { STFeature } from "../interfaces";

interface EditorComponentProps {
  activeFeature: STFeature;
  setActiveFeature: (feature: STFeature | null) => void;
  updateFeature: (feature: STFeature) => void;
  deleteFeature: (id: string) => void;
}

const EditorComponent = ({ activeFeature, setActiveFeature, updateFeature, deleteFeature }: EditorComponentProps) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, edtf, long, lat } = Object.fromEntries(formData.entries());

    const newFeature = {
      ...activeFeature,
      properties: {
        ...activeFeature.properties,
        name: typeof name === 'string' ? name : activeFeature.properties.name,
        edtf: typeof edtf === 'string' ? edtf : activeFeature.properties.edtf,
        description: typeof edtf === 'string' ? edtf : activeFeature.properties.description,
      },
      geometry: {
        ...activeFeature.geometry,
        coordinates: [
          typeof long === 'string' ? parseFloat(long) : activeFeature.geometry.coordinates[0],
          typeof lat === 'string' ? parseFloat(lat) : activeFeature.geometry.coordinates[1],
        ],
      },
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

  const close = () => {
    setActiveFeature(null);
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
          defaultValue={activeFeature.properties.edtf}
        />
      </Box>
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
