// given a geoJSON Feature Object, returns the area inside properties obj
import geojsonArea from 'geojson-area';

const getArea = featObj => {
  const { geometry } = featObj;
  const area = geojsonArea.geometry(geometry);
  featObj.properties.area = area;
  return featObj;
};
export default getArea;
