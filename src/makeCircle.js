import cloneDeep from 'lodash/cloneDeep';
import reduce from 'lodash/reduce';
import noop from 'lodash/noop';
import cleanProps from './cleanProps';
import { generateCircleApprox, areaAccumulator } from './MapHelpers';

const makeCircle = (props) => {
  const p = cloneDeep(props);
  if (!props.newCircleRadius || !props.newCircleCenter) return;
  const { features } = props;
  const circApprox = (generateCircleApprox(
    props.newCircleRadius,
    props.unit,
    props.newCircleCenter,
    24,
  ));
  if (circApprox.properties.area > props.maxAreaEach) {
    circApprox.properties.tooLarge = true;
  }
  p.features.push(circApprox);
  p.totalArea = reduce(features, areaAccumulator, 0);
  p.makeCircleOn = false;
  p.newCircleRadius = 0.1;
  cleanProps(p, props.onShapeChange, noop);
};

export default makeCircle;
