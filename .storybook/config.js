import { configure } from '@kadira/storybook';
import './storybook.styl';

//import '../css/coral.css';

function loadStories() {
  var storiesContext = require.context('../src/stories', true, /^(.*\.(js|jsx))$/);
  storiesContext.keys().forEach(storiesContext);
  //require('../src/stories/');
}

configure(loadStories, module);
