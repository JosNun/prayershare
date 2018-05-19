const rewireSvgReactLoader = require('react-app-rewire-svg-react-loader');

module.exports = function override(config, env) {
  return rewireSvgReactLoader(config, env);
};
