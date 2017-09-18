import React from 'react';
import PropTypes from 'prop-types';

class ZipRadiusControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <label labelFor="radius">Radius</label>
        <input type="text" id="radius" onChange={this.props.zipRadiusChange}></input>
        <span className="center">{this.props.center || 'center'}</span>
        <button onClick={this.props.zipRadiusClick}>Get Zips</button>
      </div>
    );
  }
}

ZipRadiusControl.propTypes = {
  center: PropTypes.string,
  zipRadiusClick: PropTypes.function,
  zipRadiusChange: PropTypes.function,
}

export default ZipRadiusControl;
