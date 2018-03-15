import fixtures from './fixtures';

const testerProps = [
  {
    name: 'default',
    props: {},
  },
  {
    name: 'edit-tools',
    props: { edit: true },
  },
  {
    name: 'yes-geolocate',
    props: { geolocate: true }
  },
  {
    name: 'points',
    props: { points: fixtures.points }
  },
  {
    name: 'points-edit',
    props: { points: fixtures.points, edit: true }
  },
  {
    name: 'large-poly',
    props: { features: fixtures.features }
  },
  {
    name: 'tightest-zoom',
    props: { zoom: 22 }
  },
  {
    name: 'poly-edit',
    props: { features: fixtures.features, edit: true }
  },
  {
    name: 'polys-and-points',
    props: { features: fixtures.citygon, points: fixtures.points, edit: true },
  },
  {
    name: 'poly-with-center',
    props: fixtures.pwc
  },
  {
    name: 'single-point',
    props: { points: fixtures.singlePoint },
  },
  {
    name: 'many-points',
    props: { points: fixtures.manyPoints, cluster: true }
  },
];

export default testerProps;
