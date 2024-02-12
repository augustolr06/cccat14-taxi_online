import { Logger } from "./Logger";
import { RideDAO } from "./RideDAO";

export class GetRide {
  constructor(private rideDAO: RideDAO, private logger: Logger) {}
  async execute(rideId: string) {
    this.logger.log("GetRide foi executado pelo usuário");
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }
}
