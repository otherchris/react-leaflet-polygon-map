import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';

import { makeCenterLeaflet, makePoint, areaAccumulator } from './MapHelpers';
import { cleanPoly, cleanPoint } from './clean';

// Pass in all props every time
export const cleanPropsFunc = (props) => {
  const p = cloneDeep(props);
  const center = makeCenterLeaflet(makePoint(props.center));
  const features = props.features || [];
  const points = props.points || [];
  const feats = map(features, (x) => cleanPoly(x, props.maxAreaEach, props.featureValidator));
  const pnts = map(points, (x) => cleanPoint(x));
  const ess = merge(p, {
    center,
    totalArea: reduce(feats, areaAccumulator, 0),
    edit: props.edit,
  });
  ess.features = feats;
  ess.points = pnts;
  return pick(ess, [
    'center',
    'edit',
    'features',
    'makeCircleOn',
    'points',
    'remove',
    'tileLayerProps',
    'zoom',
    'newCircleCenter',
    'newCircleRadius',
  ]);
  // this.maybeZoomToShapes();
};

const cleanProps = (props, update, cb) => {
  console.log("cleaning props with ", props)
  update(cleanPropsFunc(props), cb);
}

export default cleanProps;
