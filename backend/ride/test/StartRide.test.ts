import { AcceptRide } from "../src/AcceptRide";
import { GetAccount } from "../src/GetAccount";
import { GetRide } from "../src/GetRide";
import { Logger } from "../src/Logger";
import { LoggerConsole } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { RideRepositoryDatabase } from "../src/RideRepositoryDatabase";
import { Signup } from "../src/Signup";
import sinon from "sinon";
import { StartRide } from "../src/StartRide";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
  const accountRepository = new AccountRepositoryDatabase();
  const logger = new LoggerConsole();
  const rideRepository = new RideRepositoryDatabase();
  signup = new Signup(accountRepository, logger);
  requestRide = new RequestRide(rideRepository, accountRepository, logger);
  getRide = new GetRide(rideRepository, logger);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide = new StartRide(rideRepository);
});

test("Deve poder iniciar uma corrida", async function () {
  // Passenger:
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.54502219532124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
    // Driver:
    const inputSignupDriver = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      password: "123456",
      isPassenger: false,
      isDriver: true,
      carPlate: "ABC1234",
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
      rideId: outputRequestRide.rideId,
      driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide);
    const inputStartRide = {
      rideId: outputRequestRide.rideId,
    };
    await startRide.execute(inputStartRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
});

// test("Não deve poder aceitar uma corrida se a conta não for de um motorista", async function () {
//   // Passenger:
//   const inputSignupPassenger = {
//     name: "John Doe",
//     email: `john.doe${Math.random()}@gmail.com`,
//     cpf: "97456321558",
//     isPassenger: true,
//   };
//   const outputSignupPassenger = await signup.execute(inputSignupPassenger);
//   const inputRequestRide = {
//     passengerId: outputSignupPassenger.accountId,
//     fromLat: -27.584905257808835,
//     fromLong: -48.54502219532124,
//     toLat: -27.496887588317275,
//     toLong: -48.522234807851476,
//   };
//   const outputRequestRide = await requestRide.execute(inputRequestRide);
//     // Driver:
//     const inputSignupDriver = {
//       name: "John Doe",
//       email: `john.doe${Math.random()}@gmail.com`,
//       cpf: "97456321558",
//       isPassenger: false,
//       isDriver: false,
//       carPlate: "ABC1234",
//     };
//     const outputSignupDriver = await signup.execute(inputSignupDriver);
//     const inputAcceptRide = {
//       rideId: outputRequestRide.rideId,
//       driverId: outputSignupDriver.accountId,
//     };
//     await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only drivers can accept a ride"));
// });
