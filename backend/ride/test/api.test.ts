import axios from "axios";

axios.defaults.validateStatus = () => {
  return true;
};

test("Deve criar uma conta para o passageiro pela API", async () => {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  // then
  expect(outputSignup.accountId).toBeDefined();
  // usar a função getAccount para verificar se todos os dados foram salvos corretamente para aquela conta. Isso valida melhor a saída do signup.
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
  expect(outputGetAccount.is_passenger).toBe(inputSignup.isPassenger);
});

test("Não deve criar conta pela API se o nome for inválido", async () => {
  // given
  const inputSignup = {
    name: "John", // sem sobrenome
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid name");
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
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;

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
  await axios.post("http://localhost:3000/signup", inputSignup);
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid car plate");
});
