import reduce from 'lodash/reduce';
import map from 'lodash/map';
import min from 'lodash/min';
import max from 'lodash/max';

const getCoords = (arr) => {
  if (typeof arr[0][1] === 'number') return arr;
  return getCoords(arr[0]);
};

const getCenter = (polygons) => {
  if (polygons.length === 0) return [35, -83];
  let coords = [];
  map(polygons, (poly) => {
    coords = coords.concat(getCoords(poly.geometry.coordinates));
  });
  console.log(coords);
  const lats = [];
  const longs = [];
  map(coords, (coord) => {
    lats.push(coord[1]);
    longs.push(coord[0]);
  });
  return [(min(lats) + max(lats)) / 2, (min(longs) + max(longs)) / 2];
};

export default getCenter;

