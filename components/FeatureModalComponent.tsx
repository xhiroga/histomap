import Modal from 'react-modal';
import { ExtendedFeature, ExtendedFeatureCollection } from '../interfaces';
import { useEffect, useState } from 'react';

Modal.setAppElement('#__next'); // これはアクセシビリティのために必要です

interface FeatureModalComponentProps {
  geoJson: ExtendedFeatureCollection;
  setGeoJson: (geoJson: ExtendedFeatureCollection) => void;
  activeFeature: ExtendedFeature | null;
  setActiveFeature: (feature: ExtendedFeature | null) => void;
}

const FeatureModalComponent = ({ geoJson, setGeoJson, activeFeature, setActiveFeature }: FeatureModalComponentProps) => {

  const [formData, setFormData] = useState<ExtendedFeature | null>(null);

  useEffect(() => {
    if (activeFeature) {
      setFormData(activeFeature);
    }
  }, [activeFeature]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }
  const close = () => {
    setActiveFeature(null);
  };

  const save = () => {
    const newGeoJson = {
      ...geoJson,
      features: geoJson.features.map(feature => {
        if (feature.properties.id === formData.properties.id) {
          return formData;
        }
        return feature;
      }),
    };
    setGeoJson(newGeoJson);
    setActiveFeature(null);
  };

  useEffect(() => {
    console.log({ formData })
  }, [formData]);

  return (
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
      {/* TODO: ネストが深い... */}
      {formData && (
        <div>
          <h2>Edit Feature</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.properties.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Year:
              <input
                type="text"
                name="edtf"
                value={formData.properties.edtf}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Image:
              <input
                type="text"
                name="image"
                value={formData.properties.image}
                onChange={handleInputChange}
              />
            </label>
          </form>
          <button onClick={close}>Close</button>
          <button onClick={save}>Save</button>
        </div>
      )}
    </Modal>
  )
};

export default FeatureModalComponent;
