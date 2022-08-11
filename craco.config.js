const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: 
            {   '@primary-color': '#252A44',
                // '@menu-dark-item-active-bg': '#FF0000',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};