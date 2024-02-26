export function notExistInRedis(value: string) {
  if (value == null) return true;
  else return false;
}
