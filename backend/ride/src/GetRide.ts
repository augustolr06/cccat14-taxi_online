import { Logger } from "./Logger";
import { RideRepository } from "./RideRepository";

type Output = {
  rideId: string;
  status: string;
  driverId: string;
  passengerId: string;
};

export class GetRide {
  constructor(private rideRepository: RideRepository, private logger: Logger) {}
  async execute(rideId: string) {
    this.logger.log("GetRide foi executado pelo usuário");
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
    } as Output;
  }
}
