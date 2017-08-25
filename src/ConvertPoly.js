//convertpoly function takes polyline, geoJSON, wkt, wkb, wkbHex, circle paths,
//and rectangle paths and returns geoJSON
import wkx from 'wkx';
var wkx = require('wkx');
import map from 'lodash/map';
import polyline from 'polyline';

const convertPoly = (poly) => {
  switch (poly.type) {
    case 'polyline':
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": polyline.toGeoJSON(poly.data)
        }]
      };
      break;
    case 'geoJSON':
      return poly.data;
      break;
    case 'wkt':
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": wkx.Geometry.parse(poly.data).toGeoJSON()
        }]
      };
      break;
    case 'wkb':
      const encoding = poly.encoding ||'base64';
      const buf = Buffer.from(poly, encoding);
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": wkx.Geometry.parse(buf).toGeoJSON(poly.data)
        }]
      };
      break;
    case 'circle':
      const circleCoords = map(circle.data.path, (x) => [x.lng, x.lat]);
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": wkx.Geometry.parse(circleCoords).toGeoJSON // circleCoords.parse(poly.data).toGeoJSON()
          }
        }]
      };
      break;
    case 'rectangle':
      const rectCoords = map(rectangle.path, (x) => [x.lng, x.lat]);
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": rectCoords.parse(poly.data).toGeoJSON()
        }]
      };
      break;
  }
};

// export default convertPoly;

const exampleGeoJson = "geoJSON: {type: 'geoJSON', data: {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[ -85.76820373535156, 38.23966324024717 ], [ -85.75429916381836, 38.22793227923281 ], [ -85.72528839111328, 38.23022468473982 ], [ -85.74125289916992, 38.253279568348304 ], [ -85.76820373535156, 38.23966324024717 ]]]}}]}}"

console.log(convertPoly(geoJSON));
