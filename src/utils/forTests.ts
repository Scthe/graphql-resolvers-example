import nock from "nock";

// utils used in tests

export const setupNock = (): void => {
  beforeEach(() => {
    // each jest test loads modules anew
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore(); // https://github.com/nock/nock/issues/1817
  });
};
