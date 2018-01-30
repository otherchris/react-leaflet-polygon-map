const getAreaFixtures = {
  featObj: {
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
  featObjArea: {
    type: 'Feature',
    properties: {
      area: 8635914,
    },
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
  featObj2: {
    type: 'Feature',
    properties: {
      name: 'example property',
    },
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
  featObj2Area: {
    type: 'Feature',
    properties: {
      name: 'example property',
      area: 8635914,
    },
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
  circleFeatObjArea: {
    type: 'Feature',
    properties: {
      center: { lat: 38.25850297757688, lng: -85.7552433013916 },
      radius: 266.9827372809027,
      area: 213840,
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
  multiPFeatObj: {
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
  multiPFeatObjArea: {
    type: 'Feature',
    properties: {
      area: 20310537132,
    },
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

export default getAreaFixtures;