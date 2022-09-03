export function echo(args: any, callback: any) {
  callback(null, args[0] + args[1]);
}
