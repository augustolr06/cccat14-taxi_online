import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import { GetAccount } from "../src/GetAccount";
import { GetRide } from "../src/GetRide";
import { Logger } from "../src/Logger";
import { LoggerConsole } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { RideRepositoryDatabase } from "../src/RideRepositoryDatabase";
import { Signup } from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  const accountRepository = new AccountRepositoryDatabase();
  const logger = new LoggerConsole();
  const rideRepository = new RideRepositoryDatabase();
  signup = new Signup(accountRepository, logger);
  requestRide = new RequestRide(rideRepository, accountRepository, logger);
  getRide = new GetRide(rideRepository, logger);
});

test("Deve poder solicitar uma corrida", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.54502219532124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  // then
  expect(outputRequestRide.rideId).toBeDefined();
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: false,
    isDriver: true,
    carPlate: "ABC1234",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.54502219532124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  
  // then
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver oura corrida ativa", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.54502219532124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  
  // then
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger already has an active ride"));
});
