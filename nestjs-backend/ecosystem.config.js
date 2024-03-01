module.exports = [
  {
    script: 'dist/main.js',
    name: 'nest-backend:1.0',
    exec_mode: 'cluster',
    instances: 5,
  },
];
