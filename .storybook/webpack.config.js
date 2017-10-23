
const path = require('path');
const include = [
  path.resolve(__dirname, './'),
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../../'),
];

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  console.log('#######################################');
  console.log('storybookBaseConfig --- before override');
  console.log(JSON.stringify(storybookBaseConfig));
  console.log('#######################################');


  // Make whatever fine-grained changes you need
  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      // { loader: 'css-loader', options: { importLoaders: 1 } },
    ],
    include: include,
  });
  storybookBaseConfig.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: include,
  });
  storybookBaseConfig.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
    use: ['file-loader'],
    include: include,
  });
  storybookBaseConfig.resolve.alias = {
    // functional aliases
    handlebars: 'handlebars/dist/handlebars.min.js',
    // functional meteor aliases
    'meteor/check': 'uniforms/SimpleSchemaBridge.js',
    'meteor/aldeed:simple-schema': 'uniforms/SimpleSchemaBridge.js',
    // fake meteor aliases
    'meteor/meteor': 'lodash/noop.js',
    'meteor/mongo': 'lodash/noop.js',
    'meteor/random': 'lodash/noop.js',
    'meteor/tracker': 'lodash/noop.js',
    'meteor/reactive-var': 'lodash/noop.js',
    'meteor/react-meteor-data': 'lodash/noop.js',
    'meteor/session': 'lodash/noop.js',
    'meteor/accounts-base': 'lodash/noop.js',
    'meteor/accounts-password': 'lodash/noop.js',
    'meteor/alanning:roles': 'lodash/noop.js',
    'meteor/aldeed:collection2': 'lodash/noop.js',
    'meteor/aldeed:simple-schema': 'lodash/noop.js',
    'meteor/dburles:collection-helpers': 'lodash/noop.js',
    'meteor/edgee:slingshot': 'lodash/noop.js',
    'meteor/kurounin:pagination': 'lodash/noop.js',
    'meteor/matb33:collection-hooks': 'lodash/noop.js',
    'meteor/mdg:validated-method': 'lodash/noop.js',
    'meteor/mdg:validation-error': 'lodash/noop.js',
    'meteor/meteorhacks:aggregate': 'lodash/noop.js',
    'meteor/meteorhacks:search-source': 'lodash/noop.js',
    'meteor/meteorhacks:subs-manager': 'lodash/noop.js',
    'meteor/meteorhacks:unblock': 'lodash/noop.js',
    'meteor/ongoworks:security': 'lodash/noop.js',
    'meteor/react-meteor-data': 'lodash/noop.js',
    'meteor/reywood:publish-composite': 'lodash/noop.js',
    'meteor/rlivingston:simple-schema-mixin': 'lodash/noop.js',
    'meteor/service-configuration': 'lodash/noop.js',
    'meteor/sokki:impersonate': 'lodash/noop.js',
    'meteor/splendido:accounts-meld': 'lodash/noop.js',
    'meteor/tmeasday:publish-counts': 'lodash/noop.js',
    'meteor/zeroasterisk:auditlog': 'lodash/noop.js',
    'meteor/zeroasterisk:throttle': 'lodash/noop.js',
  };

  console.log('#######################################');
  console.log('storybookBaseConfig --- after override');
  console.log(JSON.stringify(storybookBaseConfig));
  console.log('#######################################');

  // Return the altered config
  return storybookBaseConfig;
};
