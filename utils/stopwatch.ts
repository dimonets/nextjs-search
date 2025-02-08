export const stopwatchWrapper = async (promise: Promise<any>) => {
  const startTime = performance.now();
  const resp = await promise;
  resp.executionTime = Math.round(performance.now() - startTime);
  return resp;
}