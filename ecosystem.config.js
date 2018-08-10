module.exports = {
  apps: [
    {
      name: 'prayershare',
      script: 'server/lib/server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
