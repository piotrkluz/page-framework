module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "verbose": false,
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/(spec|integrationSpec)/.*)\\.tsx?$",
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
