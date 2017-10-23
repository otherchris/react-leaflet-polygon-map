import { configure } from '@storybook/react';

import numberLocalizer from 'react-widgets-simple-number';

// load custom CSS (over-rides and app)

numberLocalizer();
function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
