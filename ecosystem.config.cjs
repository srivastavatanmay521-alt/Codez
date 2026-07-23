module.exports = {
  apps: [
    {
      name: "codez",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 6767,
      },
    },
  ],
};
