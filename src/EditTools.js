import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { removeListener } from './MapHelpers';

const EditTools = (p) => {
  console.log("I AM RERENDERING EDIT TOOLS")
  console.log(p.remove)
  if (p.edit) {
    return (
      <FeatureGroup>
        <EditControl
          onMounted={() => {
            const el = document.querySelector('a.leaflet-draw-edit-remove');
            el.onclick = () => {
              removeListener(p);
            };
            el.classname = 'leaflet-draw-edit-remove';
          }}
          position='topright'
          draw={{
            polyline: false,
            circlemarker: false,
            circle: false,
            marker: {
              icon: p.markerIcon,
            },
          }}
          edit={{
            edit: false,
          }}
          onCreated={p.onCreated}
        />
      </FeatureGroup>
    );
  }
  return null;
};

export default EditTools;

