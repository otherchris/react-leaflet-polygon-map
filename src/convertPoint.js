import reverse from 'lodash/reverse';

const convertPoint = (point) => {
  if (point.length === 2) {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: reverse(point),
      },
    };
  }
  if (point.type === 'Feature') return point;
  throw new Error(`Could not convert point: ${point}`);
};

export default convertPoint;
