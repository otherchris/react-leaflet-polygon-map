const poly = {
  polyline: { type: 'polyline',
    // eslint-disable-next-line max-len
    data: 'eiphFnhojOif@cn@oQgRLOzZ{z@n@gBjCce@CM~f@{SnA{@cBs[~K~G~E{Czc@nEfd@lEjCaKa@tKnGl@qDzJyBzq@fBjP~Jt@{@fPyFk@~@lToJ_AWlIhJ~@_A`S{Ii@sArRmI{@bAsRcGm@b@iIuLmAc@hI_KaA`@tIaFg@gAtSmDpHkTwBc@hI{Go@wKpQiBcB' },
  geoJSON: { 
    type: 'geoJSON',
    data: {
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
  },
  wkt: { type: 'wkt',
    // eslint-disable-next-line max-len
    data: 'POLYGON ((-85.76837539672852 38.24438205858283, -85.78210830688477 38.22442610753021, -85.75052261352539 38.236157634068825, -85.7567024230957 38.21660403859855, -85.72151184082031 38.23858461019401, -85.73284149169922 38.25368397473024, -85.75824737548828 38.24222492249137, -85.76837539672852 38.24438205858283))' },
  wkb: { type: 'wkb',
    // eslint-disable-next-line max-len
    data: 'AQMAAAABAAAABwAAAAAAAAARcFXAJgQ8deciQ0D///+PFnFVwPdxsjQpIENA////75puVcAzTdHhbyBDQAAAAIALblXAaN2/Io8iQ0AAAABwhG5VwAs8Y00uJUNAAAAAMC1vVcBxxJY7nCFDQAAAAAARcFXAJgQ8deciQ0A=' },
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
};

export default poly;
