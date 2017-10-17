import reduce from 'lodash/reduce';
import map from 'lodash/map';
import min from 'lodash/min';
import max from 'lodash/max';
import L from 'leaflet';

const getCoords = (arr) => {
  if (typeof arr[0][1] === 'number') return arr;
  return getCoords(arr[0]);
};

const getCenter = (polygons, points) => {
  if (polygons.length === 0 && points.length === 0) return [35, -83];
  let coords = [];
  map(polygons, (poly) => {
    coords = coords.concat(getCoords(poly.geometry.coordinates));
  });
  map(points, (point) => {
    coords.push(point.geometry.coordinates);
  });
  const lats = [];
  const longs = [];
  map(coords, (coord) => {
    lats.push(coord[1]);
    longs.push(coord[0]);
  });
  const c1 = L.latLng(max(lats), max(longs));
  const c2 = L.latLng(min(lats), min(longs));
  return L.latLngBounds(c1, c2);
};

export default getCenter;

