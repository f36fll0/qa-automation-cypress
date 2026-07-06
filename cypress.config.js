const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://bookcart.azurewebsites.net/?utm_source=chatgpt.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
