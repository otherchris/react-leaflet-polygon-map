// convertpoly function takes polyline, geoJSON, wkt, wkb, wkbHex, circle paths,
// and rectangle paths and returns geoJSON
import wkx from 'wkx';
import map from 'lodash/map';
import polyline from 'polyline';

const convertPoly = (poly) => {
  console.log(poly.data);
  switch (poly.type) {
  case 'polyline':
    const a = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: polyline.toGeoJSON(poly.data),
      }],
    };
    console.log('polyline results', a);
    return a;
  case 'wkt':
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: wkx.Geometry.parse(poly.data).toGeoJSON(),
      }],
    };
  case 'wkb':
  const buf = Buffer.from(poly.data, 'base64');
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: wkx.Geometry.parse(buf).toGeoJSON(poly.data),
      }],
    };
  case 'circle':
  const circleCoords = map(poly.circle.data.path, (x) => [x.lng, x.lat]);
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: wkx.Geometry.parse(circleCoords).toGeoJSON(),
        },
      }],
    };
  case 'rectangle':
  const rectCoords = map(poly.rectangle.path, (x) => [x.lng, x.lat]);
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: rectCoords.parse(poly.data).toGeoJSON(),
      }],
    };
  case 'geoJSON':
    return poly.data;
  default:
    return poly.data;
  }
  // return null;
};

export default convertPoly;

// eslint-disable-next-line max-len
// const exampleGeoJson = 'geoJSON: {type: 'geoJSON', data: {'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': {'type': 'Polygon', 'coordinates': [[[ -85.76820373535156, 38.23966324024717 ], [ -85.75429916381836, 38.22793227923281 ], [ -85.72528839111328, 38.23022468473982 ], [ -85.74125289916992, 38.253279568348304 ], [ -85.76820373535156, 38.23966324024717 ]]]}}]}}'

// console.log(convertPoly(geoJSON));
