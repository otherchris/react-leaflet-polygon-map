// given a geoJSON Feature Object, returns the area inside properties obj
import geojsonArea from 'geojson-area';
import cloneDeep from 'lodash/cloneDeep';

const addArea = featObj => {
  const f = cloneDeep(featObj);
  const { geometry } = featObj;
  const area = geojsonArea.geometry(geometry);
  f.properties.area = area / 2590000 ;
  return f;
};

export default addArea;
