import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import updateShapes from './updateShapes';
import cleanProps from './cleanProps';

const EditTools = (p) => {
  if (p.edit) {
    return (
      <FeatureGroup>
        <EditControl
          onMounted={() => {
            const el = document.querySelector('a.leaflet-draw-edit-remove');
            el.onclick = () => {
              const _p = cloneDeep(p);
              _p.remove = !p.remove;
              cleanProps(_p, p.onShapeChange, noop);
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
          onCreated={updateShapes.bind(this, p, p.bindPoint.leafletMap.leafletElement)}
        />
      </FeatureGroup>
    );
  }
  return null;
};

export default EditTools;

