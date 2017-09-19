import React from 'react';
import PropTypes from 'prop-types';
import { WithNotes } from '@storybook/addon-notes';
import map from 'lodash/map';
import omit from 'lodash/omit';
import MapContainer from '../MapContainer';

const MapContainerStoryWithNotes = (props) => {
  let propNotes = '';
  map(omit(props, 'additionalNotes'), (val, key) => {
    propNotes += `${key} = ${JSON.stringify(val, null, '  ')}\n`;
  });
  const notes = `${props.additionalNotes || ''}\n\nMapContainer with \n<pre>${propNotes}</pre>`;
  return (
    <WithNotes notes={notes}>
      <MapContainer { ...props }/>
    </WithNotes>
  );
};

MapContainerStoryWithNotes.propTypes = {
  polyArray: PropTypes.array,
  additionalNotes: PropTypes.string,
};

export default MapContainerStoryWithNotes;
