import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../MapContainer';
import { shallow } from 'enzyme';
import testPropType from './support/testPropType';

describe('apikey', () => {
  testPropType(MapContainer, 'apikey', 'string');
});

