import React from 'react';
import PropTypes from 'prop-types';

const MapSubmitButton = (props) => {
  console.log(props);
  if (!props.handleSubmit) return null;
  const disable = props.maxArea > props.totalArea;
  const text = disable ? 'Submit' : 'Area too large';
  return (
    <div className="map-submit-button">
      <button
        onClick={props.handleSubmit}
        className={disable ? 'button-disable' : ''}
      >
        {text}
      </button>
    </div>
  );
};

export default MapSubmitButton;

MapSubmitButton.propTypes = {
  handleSubmit: PropTypes.func,
  text: PropTypes.string,
  disable: PropTypes.boolean,
  maxArea: PropTypes.number,
  totalArea: PropTypes.number,
};
