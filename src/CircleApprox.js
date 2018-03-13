import React from 'react';
import PropTypes from 'prop-types';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import cleanProps from './cleanProps';
import { radiusChange } from './MapHelpers';

const CircleApprox = (props) => (
  <div className="map-circle-approx">
    Radius (in miles)
    <NumberPicker
      onChange={radiusChange.bind(this, props)}
      step={0.1}
      max={10}
      defaultValue={0.100}
      min={0}
      format={'##.###'}
      precision={2}
    />
    <button
      type="button"
      className="btn-primary save btn"
      onClick={props.makeCircle}
    >
      Create Circle
    </button>
    <button
      type="button"
      className="btn-primary save btn map-toggle-x"
      onClick={() => {
        const p = cloneDeep(props);
        p.makeCircleOn = false;
        cleanProps(p, props.onShapeChange, noop);
      }}
    >
      x
    </button>
  </div>
);

export default CircleApprox;

CircleApprox.propTypes = {
  radiusChange: PropTypes.func,
  sidesChange: PropTypes.func,
  makeCircle: PropTypes.func,
  turnOff: PropTypes.func,
};
