const polyFixtures = {
// Fixtures for mkFeatureObj
  polylineFeatureObj: { type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
      // tbd
      ]],
    },
  },
  geoJSONFeatureObj: { type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76820373535156, 38.23966324024717],
        [-85.75429916381836, 38.22793227923281],
        [-85.72528839111328, 38.23022468473982],
        [-85.74125289916992, 38.253279568348304],
        [-85.76820373535156, 38.23966324024717],
      ]],
    },
  },
  
if((condition) && (condition) && (condition)) 

  wktFeatureObj: { type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
      // tbd
      ]],
    },
  },
  wkbFeatureObj: { type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
      // tbd
      ]],
    },
  },
  circleFeatureObj: { type: 'Feature',
    properties: { center:
      { lat: 38.25850297757688, lng: -85.7552433013916 },
    radius: 266.9827372809027,
    area: 213839.345998646,
    },
    geometry: {
      type: 'Circle',
      coordinates: [[
      // tbd
      ]],
    },
  },
  rectangleFeatureObj: { type: 'Feature',
    properties: {
      bounds: { south: 38.25728983213629,
        west: -85.76575756072998,
        north: 38.257812161128484,
        east: -85.7618522644043 },
      area: 0.07134461594274134,
    },
    geometry: {
      type: 'Rectangle',
      coordinates: [[
      // tbd
      ]],
    },
  },
  // Fixtures for geoJSONWrapper
  polylineGeoJSON: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
        // tbd  
        ]],
      },
    },
    ],
  },
  geoJSONGeoJSON: { type: 'FeatureCollection',
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
    },
    ],
  },
  wktGeoJSON: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
        // tbd  
        ]],
      },
    },
    ],
  },
  wkbGeoJSON: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
        // tbd  
        ]],
      },
    },
    ],
  },
  circleGeoJSON: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { center:
        { lat: 38.25850297757688, lng: -85.7552433013916 },
      radius: 266.9827372809027,
      area: 213839.345998646,
      },
      geometry: {
        type: 'Circle',
        coordinates: [[
        // tbd
        ]],
      },
    },
    ],
  },
  rectangleGeoJSON: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        bounds: { south: 38.25728983213629,
          west: -85.76575756072998,
          north: 38.257812161128484,
          east: -85.7618522644043 },
        area: 0.07134461594274134,
      },
      geometry: {
        type: 'Rectangle',
        coordinates: [[
        // tbd
        ]],
      },
    },
    ],
  },
};

export default polyFixtures;
