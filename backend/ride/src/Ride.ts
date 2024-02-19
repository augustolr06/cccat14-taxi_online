import crypto from 'crypto';

export class Ride {
  constructor(
    readonly rideId: string, readonly passengerId: string, private driverId: string, private status: string, readonly date: Date, readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number
  ) {}

  static create( passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const date = new Date();
    const status = 'requested';
    const driverId = '';
    return new Ride(rideId, passengerId, driverId, status, date, fromLat, fromLong, toLat, toLong);
  }

  accept(driverId: string) {
    if (this.status !== 'requested') throw new Error('Ride is not in requested status');
    this.status = 'accepted';
    this.driverId = driverId;
  }

  start() {
    if (this.status !== 'accepted') throw new Error('Ride is not in accepted status');
    this.status = 'in_progress';
  }

  getDriverId() {
    return this.driverId;
  }

  getStatus() {
    return this.status;
  }
}
