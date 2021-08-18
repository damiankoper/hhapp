/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = {
  apps: [
    {
      name: 'Watering',
      script: 'dist/main.js',
      env_production: dotenv.parse(
        readFileSync(join(__dirname, '.env.production')),
      ),
      env_development: dotenv.parse(readFileSync(join(__dirname, '.env'))),
    },
  ],

  // Deployment Configuration
  deploy: {
    development: {
      user: 'pi',
      host: '192.168.0.106',
      ref: 'origin/main',
      repo: 'git@github.com:damiankoper/hhapp.git',
      path: '/home/pi/iot/watering/production',
      'post-deploy':
        'npx lerna bootstrap --scope watering && npm run build && pm2 reload pm2/pm2.config.js --env development',
    },
    production: {
      user: 'pi',
      host: '192.168.0.106',
      ref: 'origin/main',
      repo: 'git@github.com:damiankoper/hhapp.git',
      path: '/home/pi/iot/watering/production',
      'post-deploy':
        'npx lerna bootstrap --scope watering && npm run build && pm2 reload pm2/pm2.config.js --env production',
    },
  },
};
