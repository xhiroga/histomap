import { STFeature } from "../interfaces";

interface EditorComponentProps {
  activeFeature: STFeature;
  updateFeature: (feature: STFeature) => void;
}

const EditorComponent = ({ activeFeature, updateFeature }: EditorComponentProps) => {

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

  return (
    <div>
      <h2>Edit Feature</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            defaultValue={activeFeature.properties.name}
          />
        </label>
        <label>
          EDTF:
          <input
            type="text"
            name="edtf"
            defaultValue={activeFeature.properties.edtf}
          />
        </label>
        <label>
          long:
          <input
            type="text"
            name="long"
            defaultValue={activeFeature.geometry.coordinates[0]}
          />
        </label>
        <label>
          lat:
          <input
            type="text"
            name="lat"
            defaultValue={activeFeature.geometry.coordinates[1]}
          />
        </label>
        <button type="reset" onClick={close}>Close</button>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default EditorComponent;
