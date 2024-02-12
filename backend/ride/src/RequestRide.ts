import crypto from "crypto";
import { Logger } from "./Logger";
import { RideDAO } from "./RideDAO";
import AccountDAO from "./AccountDAO";

export class RequestRide {
  constructor(private rideDAO: RideDAO, private accountDAO: AccountDAO, private logger: Logger) {}
  async execute(input: any) {
    // this.logger.log("RequestRide foi executado pelo usuário");
    const account = await this.accountDAO.getById(input.passengerId);
    this.logger.log(`RequestRide foi executado pelo usuário ${account.name}. É passageiro? ${account.is_passenger}`);
    if (!account.is_passenger) throw new Error("Only passengers can request a ride");
    const activeRide = await this.rideDAO.getActiveRideByPassengerId(input.passengerId);
    if (activeRide) throw new Error("Passenger already has an active ride");
    input.rideId = crypto.randomUUID();
    input.status = "requested";
    input.date = new Date();
    await this.rideDAO.save(input);
    return {
      rideId: input.rideId,
    };
  }
}
