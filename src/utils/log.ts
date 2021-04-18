export default (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
};
