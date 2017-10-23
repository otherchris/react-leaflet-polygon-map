import React from 'react';
import PropTypes from 'prop-types';
import { NumberPicker } from 'react-widgets';

const CircleApprox = (props) => (
  <div className="circle-approx">
    Radius (in miles)
    <NumberPicker
      onChange={props.radiusChange}
      max={10}
      min={0}
      defaultValue={0.1}
      format={'##.###'}
      precision={2}
    />
    <button onClick={props.makeCircle}>
      Create Circle
    </button>
    <span className="toggle-x" onClick={props.turnOff}>
      x
    </span>
  </div>
);

export default CircleApprox;

CircleApprox.propTypes = {
  radiusChange: PropTypes.func,
  sidesChange: PropTypes.func,
  makeCircle: PropTypes.func,
  turnOff: PropTypes.func,
};
