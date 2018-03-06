import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import { removeListener } from './MapHelpers';
import cleanProps from './cleanProps';

const EditTools = (p) => {
  if (p.edit) {
    return (
      <FeatureGroup>
        <EditControl
          onMounted={() => {
            const el = document.querySelector('a.leaflet-draw-edit-remove');
            el.onclick = p.removeHandler;
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

