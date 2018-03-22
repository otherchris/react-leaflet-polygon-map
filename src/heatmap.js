import React from 'react';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const heatmap = (props) => {
  if (!props.heatmap) return '';
  return (
    <HeatmapLayer
      points={props.points}
      longitudeExtractor={m => m.geometry.coordinates[0]}
      latitudeExtractor={m => m.geometry.coordinates[1]}
      intensityExtractor={m => 100}
    />
  );
};

export default heatmap;
