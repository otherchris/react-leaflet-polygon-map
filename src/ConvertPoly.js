// convertpoly function takes polyline, geoJSON, wkt, wkb, wkbHex, circle paths,
// and rectangle paths and returns geoJSON
import wkx from 'wkx';
import map from 'lodash/map';
import polyline from 'polyline';

const ensureGeometryIsValid = geometry => {
  switch (geometry.type) {
  case 'LineString':
    geometry.coordinates = ensureShapeIsClosed(geometry.coordinates);
    return geometry;
  case 'Polygon':
    geometry.coordinates = geometry.coordinates.map(ensureShapeIsClosed);
    return geometry;
  case 'MultiPolygon':
    geometry.coordinates = geometry.coordinates.map((polys, i) => {
      return polys.map(ensureShapeIsClosed);
    });
    return geometry;
  default:
    throw Error(`Ensure Geometry - invalid geometry type: ${geometry.type}`);
  }
  return geometry;
}
const ensureShapeIsClosed = shape => {
  const last = shape.length -1;
  if (shape[0] !== shape[last]) shape.push(shape[0]);
  return shape;
}

export const mkFeatureObj = (poly) => {
  console.log('turds');
  let FeatObj = {
    type: 'Feature',
    properties: {},
    geometry: {},
  };
  switch (poly.type) {
  case 'polyline':
    return {
      type: 'Feature',
      properties: {},
      geometry: ensureGeometryIsValid(polyline.toGeoJSON(poly.data)),
    };
  case 'wkt':
    let wktGeo = wkx.Geometry.parse(poly.data).toGeoJSON();
    console.log(wktGeo);
    let FeatObj = {
      type: 'Feature',
      properties: {},
      geometry: wktGeo,
    };
    console.log('this is FeatObj', JSON.stringify(FeatObj));
    return FeatObj;
  case 'circle':
    console.log('i got to here');
    const circleCoords = map(poly.data.path, (x) => [x.lng, x.lat]);
    console.log('Circle Coords: ', circleCoords);
    const e = {
      type: 'Feature',
      properties: poly.data,
      geometry: {
        type: 'Circle',
        coordinates: wkx.Geometry.parse(circleCoords).toGeoJSON(),
      },
    };
    return e;
  case 'wkb':
    const buf = new Buffer(poly.data);
    const wkxGeo = wkx.Geometry.parse(buf);
    const c = {
      type: 'Feature',
      properties: {},
      geometry: wkxGeo.toGeoJSON(),
    };
    return c;
  case 'rectangle':
    const rectCoords = map(poly.rectangle.path, (x) => [x.lng, x.lat]);
    const f = {
        type: 'Feature',
        properties: poly.data,
        geometry: rectCoords.parse(rectCoords).toGeoJSON(),
    };
    return f;
//   case 'geoJSON':
//     const Props = poly.geoJSON.data.features.properties;
//     console.log('Props', Props);
//     const Geom = poly.geoJSON.data.geometry;
//     console.log('Geom', Geom);
//     const d = {
//       type: 'Feature',
//       properties: (poly.geoJSON.data.features.properties),
//       geometry: Geom,
//     };
//     console.log('This is d', d);
//     return d;
  }

};
export const geoJSONWrapper = (featureObj) => {

};

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


// eslint-disable-next-line max-len
// const exampleGeoJson = 'geoJSON: {type: 'geoJSON', data: {'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': {'type': 'Polygon', 'coordinates': [[[ -85.76820373535156, 38.23966324024717 ], [ -85.75429916381836, 38.22793227923281 ], [ -85.72528839111328, 38.23022468473982 ], [ -85.74125289916992, 38.253279568348304 ], [ -85.76820373535156, 38.23966324024717 ]]]}}]}}'

// console.log(convertPoly(geoJSON));
