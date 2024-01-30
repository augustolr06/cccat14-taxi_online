import AccountDAO from "../src/AccountDAO";
import { GetAccount } from "../src/GetAccount";
import { Logger } from "../src/Logger";
import { Signup } from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  signup = new Signup();
  getAccount = new GetAccount();
});

test("Deve criar uma conta para o passageiro", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta se o nome for inválido", async function () {
  // given
  const inputSignup = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar uma conta se o email for inválido", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve criar uma conta se o cpf for inválido", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "11111111111",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("Não deve criar uma conta se o email for duplicado", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await signup.execute(inputSignup);
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Duplicated account")
  );
});

test("Deve criar uma conta para o motorista", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

// Testes com mocks, stubs e spies

// No Stub você sobrescreve um comportamento dizendo o que ele deve retornar. No exemplo abaixo, para que o meu teste funcione, eu preciso que o método getById do AccountDAO retorne exatamente o inputSignup (pois é isso que ele faz) para que assim eu possa testar a criação da conta sem precisar passar por aquele método de fato (já que ele vai bater no bando de dados)
test("Deve criar uma conta para o passageiro com Stub", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const stubAccountDAOSave = sinon
    .stub(AccountDAO.prototype, "save")
    .resolves();
  const stubAccountDAOGetByEmail = sinon
    .stub(AccountDAO.prototype, "getByEmail")
    .resolves(null);
  const stubAccountDAOGetById = sinon
    .stub(AccountDAO.prototype, "getById")
    .resolves(inputSignup);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  stubAccountDAOSave.restore();
  stubAccountDAOGetByEmail.restore();
  stubAccountDAOGetById.restore();
});

// No Spy você espiona um determinado método e ele vai armazenar os resultados, para que depois você possa verificar esses resultados com o expect.
test("Deve criar uma conta para o motorista com spy", async function () {
  const spyLoggerLog = sinon.spy(Logger.prototype, "log");
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(spyLoggerLog.calledOnce).toBeTruthy();
  expect(
    spyLoggerLog.calledWith("Signup foi executado pelo usuário John Doe")
  ).toBeTruthy();
  spyLoggerLog.restore();
});

// O Mock é como se fosse uma junção de Stub e Spy. Nele você programa nele exatamente o que você quer que ele faça. O teste vai quebrar quando o Mock for verificado e o que você programou não acontecer.
test("Deve criar uma conta para o passageiro com Mock", async function () {
  const mockLogger = sinon.mock(Logger.prototype);
  mockLogger
    .expects("log")
    .withArgs("Signup foi executado pelo usuário John Doe")
    .once();
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  mockLogger.verify();
  mockLogger.restore();
});
