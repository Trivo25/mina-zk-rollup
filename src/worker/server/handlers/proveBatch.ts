export async function proveBatch(args: any, context: any, callback: any) {
  await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  callback(null, args[0]);
}
