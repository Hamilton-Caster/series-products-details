module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "jsx": true
    },
    "allowImportExportEverywhere": true,
    "sourceType": "module"
  },
  "rules": {
    "no-multiple-empty-lines": [2, { "max": 2, "maxEOF": 1 }],
    "no-mixed-operators": 0,
    "no-debugger": 0,
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-unused-vars": "warn",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    // Vue Specific rules
    // https://github.com/vuejs/eslint-plugin-vue
    "vue/require-default-prop": 0,
    "vue/name-property-casing": ["warn", "kebab-case"],
    "vue/max-attributes-per-line": [2, {
      "singleline": 3,
      "multiline": {
        "max": 3,
        "allowFirstLine": false
      }
    }],
    "vue/html-closing-bracket-newline": ["off"],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "never",
        "normal": "never"
      },
      "svg": "always",
      "math": "always"
    }]
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  "extends": ["plugin:vue/strongly-recommended"],
  // required to lint *.vue files
  "plugins": [
    "vue"
  ]
}
