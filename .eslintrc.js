module.exports = {
  "extends": "standard",
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "plugins": [
    "import"
  ],
  "rules": {
    "no-multi-spaces": 0, // to avoid errors when using Alignment plugin
    "camelcase": 0,
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "func-names": [0],
    "arrow-parens": [2, "always"],
    "quote-props": [2, "always"],
    "no-param-reassign": 0,
    "semi": [0, "always"]
  }
};