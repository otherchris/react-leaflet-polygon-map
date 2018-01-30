const poly = {
  // Alt types
  // *
  polyline: { type: 'polyline',
    // eslint-disable-next-line max-len
    data: 'eiphFnhojOif@cn@oQgRLOzZ{z@n@gBjCce@CM~f@{SnA{@cBs[~K~G~E{Czc@nEfd@lEjCaKa@tKnGl@qDzJyBzq@fBjP~Jt@{@fPyFk@~@lToJ_AWlIhJ~@_A`S{Ii@sArRmI{@bAsRcGm@b@iIuLmAc@hI_KaA`@tIaFg@gAtSmDpHkTwBc@hI{Go@wKpQiBcB' },
  wkt: { type: 'wkt',
    // eslint-disable-next-line max-len
    data: 'POLYGON ((-85.76837539672852 38.24438205858283, -85.78210830688477 38.22442610753021, -85.75052261352539 38.236157634068825, -85.7567024230957 38.21660403859855, -85.72151184082031 38.23858461019401, -85.73284149169922 38.25368397473024, -85.75824737548828 38.24222492249137, -85.76837539672852 38.24438205858283))' },
  wkb: { type: 'wkb',
    // eslint-disable-next-line max-len
    data: 'AQMAAAABAAAACAAAAAAAABAtcVXA1KtK6UcfQ0AAAAAQDnJVwP0apP65HENAAAAAkAhwVcBfg9FpOh5DQAAAANBtcFXALPterrkbQ0AAAABALW5VwFwOxfCJHkNAAAAA4OZuVcAqfmu3eCBDQAAAACCHcFXAMzDsOQEfQ0AAAAAQLXFVwNSrSulHH0NA' },
  circle: { type: 'Circle',
    data: {
      center:
      { lat: 38.25850297757688, lng: -85.7552433013916 },
      radius: 266.9827372809027,
      path: [{ lng: -85.7552433013916, lat: 38.26090132431184 },
        { lng: -85.75371608616081, lat: 38.2605799968801 },
        { lng: -85.75259811897945, lat: 38.2597021212559 },
        { lng: -85.75218895824827, lat: 38.25850293799326 },
        { lng: -85.75259820629304, lat: 38.25730377452244 },
        { lng: -85.7537161734744, lat: 38.25642593848186 },
        { lng: -85.7552433013916, lat: 38.25610463084193 },
        { lng: -85.7567704293088, lat: 38.25642593848186 },
        { lng: -85.75788839649016, lat: 38.25730377452244 },
        { lng: -85.75829764453493, lat: 38.25850293799326 },
        { lng: -85.75788848380375, lat: 38.2597021212559 },
        { lng: -85.7567705166224, lat: 38.2605799968801 }],
      area: 213839.345998646,
    },
  },
  /* rectangle: { type: 'Rectangle',
   *   data: {
   *     bounds: {
   *       south: 38.255398464291,
   *       west: -85.8063125610352,
   *       north: 38.2665858843939,
   *       east: -85.7615089416504,
   *     },
   *     path: [
   *       { lat: 38.2665858843939, lng: -85.8063125610352 },
   *       { lat: 38.2665858843939, lng: -85.7615089416504 },
   *       { lat: 38.255398464291, lng: -85.7615089416504 },
   *       { lat: 38.255398464291, lng: -85.8063125610352 },
   *     ],
   *   },
   * }, */
  /* rectangle: { type: 'Rectangle',
   *   data: {
   *     bounds: { south: 38,
   *       west: -86,
   *       north: 39,
   *       east: -85 },
   *     path: [{ lat: 39, lng: -86 },
   *       { lat: 39, lng: -85 },
   *       { lat: 38, lng: -86 },
   *       { lat: 38, lng: -85 }],
   *     // area: 0.07134461594274134,
   *   },
   * }, */
  rectangle: { type: 'Rectangle',
    data: {
      bounds: { south: 38.25728983213629,
        west: -85.76575756072998,
        north: 38.257812161128484,
        east: -85.7618522644043 },
      path: [{ lat: 38.257812161128484, lng: -85.76575756072998 },
        { lat: 38.257812161128484, lng: -85.7618522644043 },
        { lat: 38.25728983213629, lng: -85.76575756072998 },
        { lat: 38.25728983213629, lng: -85.7618522644043 }],
      area: 0.07134461594274134,
    },
  },
  // in case they accidentally send us geoJSON wrapped like an alt type
  geoJSON: {
    type: 'geoJSON',
    data: {
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
  },
  // Types we want
  // *
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
  // We don't want this. Should throw error.
  FeatureCollection: {
    type: 'FeatureCollection',
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
  // This is the type we want, ideally
  Feature: {
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
  // Google Poly
  googlePoly: {
    id: 0,
    editable: false,
    path: [
      { lat: 38.25707078982852, lng: -85.74808716773987 },
      { lat: 38.25577337185174, lng: -85.74888110160828 },
      { lat: 38.257374079001885, lng: -85.75072646141052 },
      { lat: 38.257492024449654, lng: -85.74858069419861 },
    ],
    area: 22512.66109365669,
    options: { fillColor: '#caebba' },
  },
};
export default poly;