import { format } from "util";

// Note: Jest doesn't fail a test when the error is handled using console.error
// This function was created to fail a test when there is a console.error
// Reference: https://github.com/facebook/jest/issues/6121
const { error } = global.console;

global.console.error = (...args) => {
  error(...args);
  throw new Error(format(...args));
};
