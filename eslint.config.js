const globals = require("globals");
const tseslint = require("typescript-eslint");
const js = require("@eslint/js");

module.exports = tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ["dist/", "node_modules/"],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
        },
    },
);
