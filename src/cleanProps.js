/* eslint-disable no-use-before-define */

import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import noop from 'lodash/noop';

import { makeCenterLeaflet, makePoint, areaAccumulator } from './MapHelpers';
import { cleanPoly, cleanPoint } from './clean';

// Pass in all props every time
export const cleanPropsFunc = (props) => {
  const p = cloneDeep(props);
  if (document.querySelector('a.leaflet-draw-edit-remove')) {
    const el = document.querySelector('a.leaflet-draw-edit-remove');
    el.onclick = () => {
      p.remove = !props.remove;
      cleanProps(p, props.onShapeChange, noop);
    };
    el.classname = 'leaflet-draw-edit-remove';
  }
  const center = makeCenterLeaflet(makePoint(props.center));
  const features = p.features || [];
  const points = p.points || [];
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
    'force',
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
  update(cleanPropsFunc(props), cb);
};

export default cleanProps;
