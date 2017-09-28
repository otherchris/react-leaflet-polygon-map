import wkx from 'wkx';
import L from 'leaflet';
import polyline from 'polyline';
import hasIn from 'lodash/hasIn';
import includes from 'lodash/includes';
import logoDefault from './logoDefault';

export const displayPoly = (poly) => {
  if (hasIn(poly, 'features')) return poly;
  if (includes(poly, 'POLYGON')) {
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: wkx.Geometry.parse(poly).toGeoJSON(),
      }],
    };
  }
  try {
    const buf = Buffer.from(poly, 'base64');
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: wkx.Geometry.parse(buf).toGeoJSON(),
      }],
    };
  } catch (e) {
    return polyline.toGeoJSON(poly);
  }
};

export const getTilesUrl = (url) => {
  console.log('url', url);
  return url || 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
};

export const generateIcon = (html) => new L.divIcon({
  className: 'my-div-icon',
  html: html || logoDefault,
});

export const expandPolys = (obj) => {
  if (obj.length) return obj;
  if (obj.map && obj.map.polygons) {
    return obj.map.polygons;
  }
  if (obj.type === 'FeatureCollection') {
    return obj.features;
  }
  return obj;
};
