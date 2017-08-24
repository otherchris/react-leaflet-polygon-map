//convertpoly function takes polyline, geoJSON, wkt, wkb, wkbHex, circle paths,
//and rectangle paths and returns geoJSON
import wkx from 'wkx';
import map from 'lodash/map';
import polyline from 'polyline';

const convertPoly = (poly) => {
  switch (poly.type) {
    case 'polyline':
      return polyline.toGeoJSON(poly.data);
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
          "geometry": wkx.Geometry.parse(buf).toGeoJSON()
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
            "coordinates": wkx.Geometry.parse(circleCoords).toGeoJSON() // circleCoords.parse(poly.data).toGeoJSON()
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

export default convertPoly;
