export const stopwatchWrapper = async (promise: Promise<any>) => {
  const startTime = Date.now();
  const resp = await promise;
  resp.executionTime = Date.now() - startTime;
  return resp;
}