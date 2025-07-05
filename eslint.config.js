const globals = require("globals");
const tseslint = require("typescript-eslint");
const js = require("@eslint/js");

module.exports = [
    // Global ignores
    {
        ignores: ["dist/", "node_modules/"],
    },

    // Base recommended configuration from ESLint
    js.configs.recommended,

    // TypeScript recommended configurations
    ...tseslint.configs.recommended,

    // Custom configuration for your project
    {
        files: ["**/*.ts"], // Apply these rules to all TypeScript files
        languageOptions: {
            globals: {
                ...globals.node, // Globals for Node.js environment
                ...globals.jest, // Globals for Jest tests
            },
        },
        rules: {
            // You can add any custom rules here in the future
        },
    },
];
