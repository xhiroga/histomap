import React, { ReactElement, useEffect, useRef } from "react";
import { GeoJSON, GeoJSONProps } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";

/**
 * GeoJsonWithUpdates is a wrapper around react-leaflet's GeoJSON component to support data changes
 * See https://github.com/PaulLeCam/react-leaflet/issues/332
 *
 * It accepts the same props like react-leaflet's GeoJSON component.
 * However, updates are only supported
 */
export default function GeoJsonWithUpdates(props: GeoJSONProps): ReactElement {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) {
      layer.clearLayers().addData(props.data);
      // clearLayers() seems to remove the `pathOptions`, `style` and `interactive` prop as well
      // Resetting it here
      if (props.pathOptions) {
        layer.setStyle(props.pathOptions);
      } else if (props.style) {
        layer.setStyle(props.style);
      }
    }
  }, [props.data, props.pathOptions, props.style]);

  return <GeoJSON {...props} ref={geoJsonLayerRef} />;
}
