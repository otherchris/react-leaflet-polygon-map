const polyFixtures = {
  polyline: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Coordinates TBD
            // [ -85.76820373535156, 38.23966324024717 ],
            // [ -85.75429916381836, 38.22793227923281 ],
            // [ -85.72528839111328, 38.23022468473982 ],
            // [ -85.74125289916992, 38.253279568348304 ],
            // [ -85.76820373535156, 38.23966324024717 ]
          ],
        ],
      },
    }],
  },
  geoJson: { type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
        ],
      },
    }],
  },
};

export default polyFixtures;
