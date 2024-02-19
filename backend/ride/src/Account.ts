import crypto from 'crypto'
import { validateCpf } from "./CpfValidator";

export class Account {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string
  isDriver: boolean;
  isPassenger: boolean;

  private constructor (accountId: string, name: string, email: string, cpf: string, carPlate: string, isDriver: boolean, isPassenger: boolean) {
    if (!this.isValidName(name)) throw new Error("Invalid name");
    if (!this.isValidEmail(email)) throw new Error("Invalid email");
    if (!validateCpf(cpf)) throw new Error("Invalid cpf");
    if (isDriver && !this.isValidCarPlate(carPlate)) throw new Error("Invalid car plate");
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.carPlate = carPlate;
    this.isDriver = isDriver;
    this.isPassenger = isPassenger;
  }
  // O método create é responsável por criar uma nova instância de Account, por isso ela CRIA um novo id para a conta
  static create(name: string, email: string, cpf: string, carPlate: string, isDriver: boolean, isPassenger: boolean) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, carPlate, isDriver, isPassenger);
  }

  // O método restore é responsável por restaurar uma instância de Account com dados já existentes, por isso ele RECEBE o id da conta
  static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isDriver: boolean, isPassenger: boolean) {
    return new Account(accountId, name, email, cpf, carPlate, isDriver, isPassenger);
  }

  isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/);
  }

  isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }
}
