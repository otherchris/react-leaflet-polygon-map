import map from 'lodash/map';

const manyPointsFunc = () => {
  const points = new Array(1000);
  return map(points, () => { return {
    type: "Feature",
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [-85 + Math.random(), 38 + Math.random()]
    },
  }});
};

const manyPoints = manyPointsFunc();

const point_1 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-85.7365740807634, 38.198252],
  },
}

const point_2 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-85.8365740807634, 38.098252],
  },
}

const point_3 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-95.8365740807634, 38.098252],
  },
}

const center = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-83, 35],
  },
};

const citygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [
         [
            [
              -85.76030731201172,
              38.24714579565491
            ],
            [
              -85.75627326965332,
              38.24714579565491
            ],
            [
              -85.75627326965332,
              38.250583468289534
            ],
            [
              -85.76030731201172,
              38.250583468289534
            ],
            [
              -85.76030731201172,
              38.24714579565491
            ]
          ]
       ]
    ]
  }
};

const large = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [
        [
          [
              -112.35305786132812,
            36.07352228885536
            ],
          [
              -112.01179504394531,
            36.07352228885536
            ],
          [
              -112.01179504394531,
            36.33172177145511
            ],
          [
              -112.35305786132812,
            36.33172177145511
            ],
          [
              -112.35305786132812,
            36.07352228885536
            ]
        ]
      ]
    ]
  }
};


const points = [point_1, point_2];
const singlePoint = [point_3];
const features = [large];
const citygonFeatures = [citygon];
const pwc = {
  features: [large],
  center,
}

export default { manyPoints, singlePoint, points, features, citygon: citygonFeatures, pwc };
