import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import { GetAccount } from "../src/GetAccount";
import { GetRide } from "../src/GetRide";
import { Logger } from "../src/Logger";
import { LoggerConsole } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { RideDAODatabase } from "../src/RideDAODatabase";
import { Signup } from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const logger = new LoggerConsole();
  const rideDAO = new RideDAODatabase();
  signup = new Signup(accountDAO, logger);
  requestRide = new RequestRide(rideDAO, logger);
  getRide = new GetRide(rideDAO, logger);
});

test("Deve solicitar uma corrida", async function () {
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
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.54502219532124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  console.log(outputGetRide);
  // then
  expect(outputRequestRide.rideId).toBeDefined();
  expect(outputGetRide.passenger_id).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.status).toBe("requested");
  expect(outputGetRide.date).toBeDefined();
});
