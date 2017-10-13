import React from 'react';
import PropTypes from 'prop-types';

const MapSubmitButton = (props) => {
  if (!props.handleSubmit) return null;
  const button = props.submitButton || {};
  const disable = props.maxArea > props.totalArea;
  const submitText = button.text || 'Submit';
  const text = disable ? submitText : 'Area too large';
  return (
    <div className={`map-submit-button }`}>
      <button
        onClick={props.handleSubmit}
        className={`${button.className} ${disable ? 'button-disable' : ''}`}
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
  disable: PropTypes.bool,
  maxArea: PropTypes.number,
  totalArea: PropTypes.number,
  submitButton: PropTypes.object,
};
