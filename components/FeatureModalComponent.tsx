import Modal from 'react-modal';
import { STFeature, STFeatureCollection, STMap } from '../interfaces';
import { useEffect, useState } from 'react';

Modal.setAppElement('#__next'); // これはアクセシビリティのために必要です

interface FeatureModalComponentProps {
  map: STMap;
  setMap: (map: STMap) => void;
  activeFeature: STFeature | null;
  setActiveFeature: (feature: STFeature | null) => void;
}

const FeatureModalComponent = ({ map, setMap, activeFeature, setActiveFeature }: FeatureModalComponentProps) => {
  const [formData, setFormData] = useState<STFeature | null>(null);

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
    if (!formData) {
      return;
    }
    const features = map.featureCollection.features.map(feature => {
      if (feature.properties.id === formData.properties.id) {
        return formData;
      }
      return feature;
    });

    setMap({
      ...map,
      featureCollection: {
        ...map.featureCollection,
        features,
      },
    });
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
          </form>
          <button onClick={close}>Close</button>
          <button onClick={save}>Save</button>
        </div>
      )}
    </Modal>
  )
};

export default FeatureModalComponent;
