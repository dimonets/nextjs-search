export const stopwatchWrapper = async (promise: Promise<any>) => {
  const startTime = performance.now();
  const resp = await promise;
  resp.executionTime = performance.now() - startTime;
  return resp;
}