const polyFixtures = {
  // Fixture for ensureShapeIsClosed
  polylineFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
        [-85.76106, 38.27257],
        [-85.75148, 38.26811],
        [-85.75096, 38.26787],
        [-85.74486, 38.26717],
        [-85.74479, 38.26719],
        [-85.74145, 38.26079],
        [-85.74115, 38.26039],
        [-85.73657, 38.26089],
        [-85.73801, 38.25881],
        [-85.73723, 38.25769],
        [-85.73827, 38.25179],
        [-85.7393, 38.24583],
        [-85.73737, 38.24513],
        [-85.7394, 38.2453],
        [-85.73963, 38.24394],
        [-85.74153, 38.24483],
        [-85.74967, 38.24544],
        [-85.75245, 38.24492],
        [-85.75272, 38.243],
        [-85.75548, 38.2433],
        [-85.75526, 38.24455],
        [-85.75869, 38.24423],
        [-85.75837, 38.24607],
        [-85.76004, 38.24619],
        [-85.76036, 38.24438],
        [-85.76357, 38.2447],
        [-85.76336, 38.24644],
        [-85.7665, 38.24686],
        [-85.7662, 38.24853],
        [-85.76306, 38.24819],
        [-85.76283, 38.24949],
        [-85.76118, 38.24931],
        [-85.76079, 38.2515],
        [-85.76244, 38.25168],
        [-85.76211, 38.2536],
        [-85.76382, 38.25343],
        [-85.76362, 38.25456],
        [-85.76693, 38.25492],
        [-85.76846, 38.25579],
        [-85.76786, 38.25921],
        [-85.76951, 38.25939],
        [-85.76927, 38.26081],
        [-85.77224, 38.26285],
        [-85.77174, 38.26338],
        [-85.77176, 38.26339],
      ],
    },
  },
  lineStringFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
      ],
    },
  },
  lineStringFeatObj2: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
        [-85.77176, 38.26339],
      ],
    },
  },
  closedLineStringFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
        [-85.77176, 38.26339],
      ]],
    },
  },
  multipolyFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
            [-85.77176, 38.26339],
          ],
        ],
      ],
    },
  },
  multipolyFeatObj2: { // this is actually a polygon
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
            [-85.77176, 38.26339],
          ],
        ],
      ],
    },
  },
  multipolyFeatObj3: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
            [-85.77176, 38.26339],
          ],
        ],
      ],
    },
  },
  openMultipolyFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
          ],
        ],
      ],
    },
  },
  multipolyFeatObj4: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
            [-85.77176, 38.26339],
          ],
        ],
      ],
    },
  },
  mixedMultipolyFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-85.76820373535156, 38.23966324024717],
            [-85.75429916381836, 38.22793227923281],
            [-85.72528839111328, 38.23022468473982],
            [-85.74125289916992, 38.253279568348304],
            [-85.76820373535156, 38.23966324024717],
          ],
          [
            [-85.77176, 38.26339],
            [-85.76422, 38.26968],
            [-85.76114, 38.27264],
          ],
        ],
      ],
    },
  },
  // ensureGeometryIsValid

  // Fixtures for mkFeatureObj
  polylineFeatObj2: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
        [-85.76106, 38.27257],
        [-85.75148, 38.26811],
        [-85.75096, 38.26787],
        [-85.74486, 38.26717],
        [-85.74479, 38.26719],
        [-85.74145, 38.26079],
        [-85.74115, 38.26039],
        [-85.73657, 38.26089],
        [-85.73801, 38.25881],
        [-85.73723, 38.25769],
        [-85.73827, 38.25179],
        [-85.7393, 38.24583],
        [-85.73737, 38.24513],
        [-85.7394, 38.2453],
        [-85.73963, 38.24394],
        [-85.74153, 38.24483],
        [-85.74967, 38.24544],
        [-85.75245, 38.24492],
        [-85.75272, 38.243],
        [-85.75548, 38.2433],
        [-85.75526, 38.24455],
        [-85.75869, 38.24423],
        [-85.75837, 38.24607],
        [-85.76004, 38.24619],
        [-85.76036, 38.24438],
        [-85.76357, 38.2447],
        [-85.76336, 38.24644],
        [-85.7665, 38.24686],
        [-85.7662, 38.24853],
        [-85.76306, 38.24819],
        [-85.76283, 38.24949],
        [-85.76118, 38.24931],
        [-85.76079, 38.2515],
        [-85.76244, 38.25168],
        [-85.76211, 38.2536],
        [-85.76382, 38.25343],
        [-85.76362, 38.25456],
        [-85.76693, 38.25492],
        [-85.76846, 38.25579],
        [-85.76786, 38.25921],
        [-85.76951, 38.25939],
        [-85.76927, 38.26081],
        [-85.77224, 38.26285],
        [-85.77174, 38.26338],
      ],
    },
  },
  geoJSONFeatObj: {
    type: 'Feature',
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
  geoJSONMultiPolyFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [102.0, 2.0],
            [103.0, 2.0],
            [103.0, 3.0],
            [102.0, 3.0],
            [102.0, 2.0],
          ],
        ],
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
          [
            [100.2, 0.2],
            [100.2, 0.8],
            [100.8, 0.8],
            [100.8, 0.2],
            [100.2, 0.2],
          ],
        ],
      ],
    },
  },
  wktFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76837539672852, 38.24438205858283],
        [-85.78210830688477, 38.22442610753021],
        [-85.75052261352539, 38.236157634068825],
        [-85.7567024230957, 38.21660403859855],
        [-85.72151184082031, 38.23858461019401],
        [-85.73284149169922, 38.25368397473024],
        [-85.75824737548828, 38.24222492249137],
        [-85.76837539672852, 38.24438205858283],
      ]],
    },
  },
  wkbFeatObj: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76837539672852, 38.24438205858283],
        [-85.78210830688477, 38.22442610753021],
        [-85.75052261352539, 38.236157634068825],
        [-85.7567024230957, 38.21660403859855],
        [-85.72151184082031, 38.23858461019401],
        [-85.73284149169922, 38.25368397473024],
        [-85.75824737548828, 38.24222492249137],
        [-85.76837539672852, 38.24438205858283],
      ]],
    },
  },
  circleFeatObj: {
    type: 'Feature',
    properties: {
      center: { lat: 38.25850297757688, lng: -85.7552433013916 },
      radius: 266.9827372809027,
      area: 213839.345998646,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.7552433013916, 38.26090132431184],
        [-85.75371608616081, 38.2605799968801],
        [-85.75259811897945, 38.2597021212559],
        [-85.75218895824827, 38.25850293799326],
        [-85.75259820629304, 38.25730377452244],
        [-85.7537161734744, 38.25642593848186],
        [-85.7552433013916, 38.25610463084193],
        [-85.7567704293088, 38.25642593848186],
        [-85.75788839649016, 38.25730377452244],
        [-85.75829764453493, 38.25850293799326],
        [-85.75788848380375, 38.2597021212559],
        [-85.7567705166224, 38.2605799968801],
      ]],
    },
  },
  rectangleFeatObj: {
    type: 'Feature',
    properties: {
      bounds: { south: 38.25728983213629,
        west: -85.76575756072998,
        north: 38.257812161128484,
        east: -85.7618522644043 },
      area: 0.07134461594274134,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76575756072998, 38.257812161128484],
        [-85.7618522644043, 38.257812161128484],
        [-85.76575756072998, 38.25728983213629],
        [-85.7618522644043, 38.25728983213629],
      ]],
    },
  },
  // Fixtures for geoJSONWrapper
  polylineGeoJSON: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.77176, 38.26339],
        [-85.76422, 38.26968],
        [-85.76114, 38.27264],
        [-85.76106, 38.27257],
        [-85.75148, 38.26811],
        [-85.75096, 38.26787],
        [-85.74486, 38.26717],
        [-85.74479, 38.26719],
        [-85.74145, 38.26079],
        [-85.74115, 38.26039],
        [-85.73657, 38.26089],
        [-85.73801, 38.25881],
        [-85.73723, 38.25769],
        [-85.73827, 38.25179],
        [-85.7393, 38.24583],
        [-85.73737, 38.24513],
        [-85.7394, 38.2453],
        [-85.73963, 38.24394],
        [-85.74153, 38.24483],
        [-85.74967, 38.24544],
        [-85.75245, 38.24492],
        [-85.75272, 38.243],
        [-85.75548, 38.2433],
        [-85.75526, 38.24455],
        [-85.75869, 38.24423],
        [-85.75837, 38.24607],
        [-85.76004, 38.24619],
        [-85.76036, 38.24438],
        [-85.76357, 38.2447],
        [-85.76336, 38.24644],
        [-85.7665, 38.24686],
        [-85.7662, 38.24853],
        [-85.76306, 38.24819],
        [-85.76283, 38.24949],
        [-85.76118, 38.24931],
        [-85.76079, 38.2515],
        [-85.76244, 38.25168],
        [-85.76211, 38.2536],
        [-85.76382, 38.25343],
        [-85.76362, 38.25456],
        [-85.76693, 38.25492],
        [-85.76846, 38.25579],
        [-85.76786, 38.25921],
        [-85.76951, 38.25939],
        [-85.76927, 38.26081],
        [-85.77224, 38.26285],
        [-85.77174, 38.26338],
        [-85.77176, 38.26339],
      ]],
    },
  },
  geoJSONGeoJSON: {
    type: 'Feature',
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
  wktGeoJSON: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76837539672852, 38.24438205858283],
        [-85.78210830688477, 38.22442610753021],
        [-85.75052261352539, 38.236157634068825],
        [-85.7567024230957, 38.21660403859855],
        [-85.72151184082031, 38.23858461019401],
        [-85.73284149169922, 38.25368397473024],
        [-85.75824737548828, 38.24222492249137],
        [-85.76837539672852, 38.24438205858283],
      ]],
    },
  },
  wkbGeoJSON: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-85.76837539672852, 38.24438205858283],
        [-85.78210830688477, 38.22442610753021],
        [-85.75052261352539, 38.236157634068825],
        [-85.7567024230957, 38.21660403859855],
        [-85.72151184082031, 38.23858461019401],
        [-85.73284149169922, 38.25368397473024],
        [-85.75824737548828, 38.24222492249137],
        [-85.76837539672852, 38.24438205858283],
      ]],
    },
  },
  circleGeoJSON: {
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
  rectangleGeoJSON: {
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
  geoJSONMultiPoly: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [102.0, 2.0],
            [103.0, 2.0],
            [103.0, 3.0],
            [102.0, 3.0],
            [102.0, 2.0],
          ],
        ],
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
          [
            [100.2, 0.2],
            [100.2, 0.8],
            [100.8, 0.8],
            [100.8, 0.2],
            [100.2, 0.2],
          ],
        ],
      ],
    },
  },
};

export default polyFixtures;
