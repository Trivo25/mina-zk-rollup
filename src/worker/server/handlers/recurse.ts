export async function recurse(args: any, context: any, callback: any) {
  await new Promise((resolve) => setTimeout(resolve, 40 * 1000));
  callback(null, args[0]);
}
