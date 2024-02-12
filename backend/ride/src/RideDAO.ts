export interface RideDAO {
  save(input: any): Promise<void>;
  getById(rideId: string): Promise<any>;
}
