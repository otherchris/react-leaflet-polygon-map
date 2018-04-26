import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';

const manyPointsFunc = () => {
  const t0 = performance.now();
  const points = new Array(7000);
  const geo = map(points, () => { return {
    type: "Feature",
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [-85 + Math.random(), 38 + Math.random()]
    },
  }});
  const t1 = performance.now();
  console.log("point generation: ", (t1 - t0))
  return geo;
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

const transparent_point = cloneDeep(point_3)
transparent_point.properties.style = { fillOpacity: 0.5 }

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

const bluegon = cloneDeep(citygon)
bluegon.properties.style = { fillColor: 'blue' }

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

const styled = { features: [bluegon], points: [transparent_point] }
const points = [point_1, point_2];
const singlePoint = [point_3];
const features = [large];
const citygonFeatures = [citygon];
const pwc = {
  features: [large],
  center,
}

export default { manyPoints, singlePoint, points, features, citygon: citygonFeatures, pwc, styled };
