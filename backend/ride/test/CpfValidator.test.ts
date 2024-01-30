import { isValidCpf } from "../src/CpfValidator";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve testar CPFs válidos",
  async function (cpf: string) {
    expect(isValidCpf(cpf)).toBe(true);
  }
);

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Deve testar CPFs inválidos",
  async (cpf: any) => {
    expect(isValidCpf(cpf)).toBe(false);
  }
);
