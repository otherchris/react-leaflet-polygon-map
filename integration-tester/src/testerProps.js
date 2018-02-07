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
];

export default testerProps;
