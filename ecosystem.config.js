module.exports = {
  apps: [
    {
      name: 'operon',
      cwd: '/home/azureuser/cogniqa-v1',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_SITE_URL: 'https://operon.cogniqa.systems',
        NEXT_PUBLIC_APP_URL: 'https://operon.cogniqa.systems',
      },
    },
  ],
};
