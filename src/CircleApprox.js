import React from 'react';
import PropTypes from 'prop-types';
import { NumberPicker } from 'react-widgets';
import numberLocalizer from 'react-widgets/lib/localizers/simple-number';

numberLocalizer();

const CircleApprox = (props) => (
  <div className="circle-approx">
    Radius (in miles)
    <NumberPicker
      onChange={props.radiusChange}
      max={10}
      min={0}
      format={'##.###'}
      precision={2}
    />
    <button
      type="button"
      className="circ-approx-button btn"
      onClick={props.makeCircle}
    >
      Create Circle
    </button>
    <button
      type="button"
      className="circ-approx-button btn toggle-x"
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
