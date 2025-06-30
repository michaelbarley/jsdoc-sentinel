export function diffParams(
  codeParams: readonly string[],
  docParams: readonly string[]
): { missing: string[]; extra: string[] } {
  const missing = codeParams.filter((name) => !docParams.includes(name));
  const extra = docParams.filter((name) => !codeParams.includes(name));
  return { missing, extra };
}
