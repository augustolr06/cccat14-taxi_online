import AccountDAO from "./AccountDAO";
import { RideDAO } from "./RideDAO";


export class StartRide {
  constructor(private rideDAO: RideDAO) {}
  async execute(input: any) {
    const ride = await this.rideDAO.getById(input.rideId);
    ride.status = "in_progress";
    await this.rideDAO.update(ride);
  }
}
