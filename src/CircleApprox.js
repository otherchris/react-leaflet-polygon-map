import React from 'react';
import PropTypes from 'prop-types';

const CircleApprox = (props) => (
  <div className="circle-approx">
    Radius (in miles)
    <input type="text" onChange={props.radiusChange} />
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
