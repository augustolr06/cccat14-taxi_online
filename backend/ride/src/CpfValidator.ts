export function validateCpf(cpf: string) {
  if (!cpf) return false;
  cpf = cleanCpf(cpf);
  if (isInvalidCpfLength(cpf)) return false;
  if (allCpfDigitsAreTheSame(cpf)) return false;
  const dg1 = calculateDigit(cpf, 10);
  const dg2 = calculateDigit(cpf, 11);
  return extractCpfCheckDigit(cpf) == `${dg1}${dg2}`;
}

function cleanCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isInvalidCpfLength(cpf: string) {
  return cpf.length !== 11;
}

function allCpfDigitsAreTheSame(cpf: string) {
  return cpf.split("").every((character) => character === cpf[0]);
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractCpfCheckDigit(cpf: string) {
  return cpf.slice(9);
}
