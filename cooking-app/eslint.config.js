// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", "./app"],
            ["@components", "./app/components"],
            ["@utils", "./app/utils"],
            ["@hooks", "./app/hooks"],
            ["@assets", "./app/assets"],
            ["@contexts", "./app/contexts"],
            ["@constants", "./app/constants"],
            ["@src", "./app/src"]
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    }
  }
]);
