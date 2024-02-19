import { Logger } from "./Logger";
import { RideRepository } from "./RideRepository";
import AccountRepository from "./AccountRepository";
import { Ride } from "./Ride";

type input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};

export class RequestRide {
  constructor(private rideRepository: RideRepository, private accountRepository: AccountRepository, private logger: Logger) {}
  async execute(input: input): Promise<Output> {
    this.logger.log("RequestRide foi executado pelo usuário");
    const account = await this.accountRepository.getById(input.passengerId);
    this.logger.log(`RequestRide foi executado pelo usuário ${account?.name || "unknown"}`);
    if (!account) throw new Error("Account not found");
    if (!account.isPassenger) throw new Error("Only passengers can request a ride");
    const activeRide = await this.rideRepository.getActiveRideByPassengerId(input.passengerId);
    if (activeRide) throw new Error("Passenger already has an active ride");
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId,
    };
  }
}
