export default (...args: any[]): void => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
};
