// given a geoJSON Feature Object, returns the area inside properties obj
import geojsonArea from 'geojson-area';

const addArea = featObj => {
  console.log('featOb', featObj);
  const { geometry } = featObj;
  const area = geojsonArea.geometry(geometry);
  featObj.properties.area = area / 2590000 ;
  return featObj;
};
export default addArea;
