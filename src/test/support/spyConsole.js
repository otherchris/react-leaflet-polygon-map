const spyConsole = () => {
  let spy = {};

  beforeAll(() => {
    spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    spy.console.mockRestore();
  });

  return spy;
}

export default spyConsole;


