import crypto from "crypto";
import { Logger } from "./Logger";
import SignupAccountDAO from "./SignupAccountDAO";
import { RideDAO } from "./RideDAO";

export class RequestRide {
  constructor(private rideDAO: RideDAO, private logger: Logger) {}
  async execute(input: any) {
    this.logger.log("RequestRide foi executado pelo usuário");
    input.rideId = crypto.randomUUID();
    input.status = "requested";
    input.date = new Date();
    await this.rideDAO.save(input);
    return {
      rideId: input.rideId,
    };
  }
}
