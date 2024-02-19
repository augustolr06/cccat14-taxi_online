import { Account } from "../src/Account"

test("Deve criar uma conta para um passageiro", function () {
  const inputAccount = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "",
    isDriver: false,
    isPassenger: true,
  }
  const account = Account.create(inputAccount.name, inputAccount.email, inputAccount.cpf, inputAccount.carPlate, inputAccount.isDriver, inputAccount.isPassenger)

  expect(account.accountId).toBeDefined()
  expect(account.name).toBe(inputAccount.name)
  expect(account.email).toBe(inputAccount.email)
  expect(account.cpf).toBe(inputAccount.cpf)
  expect(account.carPlate).toBe(inputAccount.carPlate)
  expect(account.isDriver).toBe(inputAccount.isDriver)
  expect(account.isPassenger).toBe(inputAccount.isPassenger)
})
