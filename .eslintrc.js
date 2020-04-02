module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ["standard"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    semi: ["error", "always"],
    camelcase: [2, { error: "never" }],
    "import/prefer-default-export": "off",
    "no-unused-expressions": ["error", { allowTaggedTemplates: true }]
  }
};
