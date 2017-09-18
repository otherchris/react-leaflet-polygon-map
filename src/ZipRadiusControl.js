import React from 'react';

class ZipRadiusControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <label labelFor="radius">Radius</label>
        <input type="text" id="radius"></input>
        <span className="center">{this.props.center || 'center'}</span>
        <button>Sumbit</button>
      </div>
    );
  }
}

export default ZipRadiusControl;
