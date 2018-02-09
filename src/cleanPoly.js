import cloneDeep from 'lodash/cloneDeep';
import uuid from 'uuid';

const cleanPoly (poly) => {
  let p = cloneDeep(poly);

  // Add area
  if (!p.properties.area) p = addArea(p);

  // Check max area
  if(p.properties.area > maxAreaEach) p.properties.tooLarge = true;

  // Tag with id if not already tagged
  if (!p.properties.key) p.properties.key = uuid.v4();

  // Fix if 'Polygon' type
  if (p.geometry.type === 'Polygon') {
    p.geometry.type = 'MultiPolygon';
    p.geometry.coordinates = [p.geometry.coordinates];
  }

  // Add errors if needed
  return validateShape(p)
};

export default cleanPoly;
