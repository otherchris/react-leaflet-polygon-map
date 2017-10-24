import React from 'react';
import PropTypes from 'prop-types';
import { NumberPicker } from 'react-widgets';

const CircleApprox = (props) => (
  <div className="circle-approx btn-group">
    Radius (in miles)
    <NumberPicker
      className="radius-picker"
      onChange={props.radiusChange}
      max={10}
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
      className="btn-primary save btn toggle-x"
      onClick={props.turnOff}
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
