import { log } from "console";
import { getAccount, signup } from "../src/main";
import { execPath } from "process";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve criar uma conta para o passageiro",
  async (cpf: string) => {
    // given
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: "123456",
    };
    // when
    const outputSignup = await signup(inputSignup);
    const outputGetAccount = await getAccount(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    // usar a função getAccount para verificar se todos os dados foram salvos corretamente para aquela conta. Isso valida melhor a saída do signup.
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
    expect(outputGetAccount.is_passenger).toBe(inputSignup.isPassenger);
  }
);

test("Não deve criar conta se o nome for inválido", async () => {
  // given
  const inputSignup = {
    name: "John", // sem sobrenome
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // then // when
  await expect(() => signup(inputSignup)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar conta se o email for inválido", async () => {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}gmail.com`, // sem o @
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // then // when
  await expect(() => signup(inputSignup)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test.each(["", undefined, null, "111", "11111111111111", "11111111111"])(
  "Não deve criar conta se o cpf for inválido",
  async (cpf: any) => {
    // given
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: "123456",
    };
    // when // then
    await expect(() => signup(inputSignup)).rejects.toThrow(
      new Error("Invalid cpf")
    );
  }
);

test("Não deve criar conta se o email for duplicado", async () => {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when   // then
  await signup(inputSignup);
  await expect(() => signup(inputSignup)).rejects.toThrow(
    new Error("Duplicated account")
  );
});

test("Deve criar uma conta para o motorista", async () => {
  // given
  const inputSignup = {
    name: "john Driver",
    email: `john.driver${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: false,
    isDriver: true,
    carPlate: "ABC1234",
    password: "654321",
  };
  // when
  const outputSignup = await signup(inputSignup);
  const outputGetAccount = await getAccount(outputSignup.accountId);
  console.log(outputGetAccount);

  // then
  expect(outputSignup.accountId).toBeDefined();
  // usar a função getAccount para verificar se todos os dados foram salvos corretamente para aquela conta. Isso valida melhor a saída do signup.
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
  expect(outputGetAccount.is_passenger).toBe(inputSignup.isPassenger);
  expect(outputGetAccount.is_driver).toBe(inputSignup.isDriver);
  expect(outputGetAccount.car_plate).toBe(inputSignup.carPlate);
});

test("Não deve criar conta para o motorista se a placa do carro for inválida", async () => {
  // given
  const inputSignup = {
    name: "john Driver",
    email: `john.driver${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: false,
    isDriver: true,
    carPlate: "abc1234", // placa não atende à verificação da regex
    password: "654321",
  };
  // when
  // then
  await expect(signup(inputSignup)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});
