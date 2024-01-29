const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals:{
    "ts-jest":{
        tsconfig: "tsconfig.test.json"
    }
  }
};
