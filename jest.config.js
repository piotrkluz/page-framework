module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "verbose": true,
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/spec/.*)\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "preset": "jest-puppeteer",
  "setupFilesAfterEnv": [
    "jest-extended"
  ]
};
