const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin, } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin, } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
module.exports = defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: "http://localhost",
        specPattern: [
            "cypress/e2e/**/*.cy.js",
            "cypress/e2e/**/*.feature",
            "cypress/ui/**/*.cy.js",
            'cypress/api/**/*.cy.js'
        ],
        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config);
            on("file:preprocessor", createBundler({
                plugins: [createEsbuildPlugin(config)],
            }));
            return config;
        },
    },
});
