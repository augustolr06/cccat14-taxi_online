import { Ride } from "./Ride";

export interface RideRepository {
  save(input: Ride): Promise<void>;
  update(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride | undefined>;
  list(): Promise<Ride[]>;
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
}
