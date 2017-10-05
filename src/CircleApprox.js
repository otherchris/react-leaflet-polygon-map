import React from 'react';
import PropTypes from 'prop-types';

const CircleApprox = (props) => (
  <div>
    Radius (in miles)
    <input type="text" onChange={props.radiusChange} />
    Sides
    <input type="text" onChange={props.sidesChange} />
    <button onClick={props.makeCircle}>
      Create Circle
    </button>
  </div>
);

export default CircleApprox;

CircleApprox.propTypes = {
  radiusChange: PropTypes.func,
  sidesChange: PropTypes.func,
  makeCircle: PropTypes.func,
};
