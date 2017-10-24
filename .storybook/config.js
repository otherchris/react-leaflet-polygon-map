import { configure } from '@storybook/react';
import numberLocalizer from 'react-widgets-simple-number';
import 'react-widgets/dist/css/react-widgets.css';

numberLocalizer();
function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
