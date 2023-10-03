module.exports = {
  apps: [
    {
      name: "projectrix-watcher",
      script: "npm run prepublish",
      watch: ["src"],
      autorestart: false,
    },
  ],
};
