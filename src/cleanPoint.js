import cloneDeep from 'lodash/cloneDeep';
import uuid from 'uuid';

const cleanPoint (point) => {
  let p = cloneDeep(point);

  // Tag with id if not already tagged
  if (!p.properties.key) p.properties.key = uuid.v4();
};

export default cleanPoint;
