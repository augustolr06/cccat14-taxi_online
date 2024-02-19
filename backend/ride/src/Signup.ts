import { Account } from "./Account";
import AccountRepository from "./AccountRepository";
import { Logger } from "./Logger";

type Input = {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isDriver?: boolean;
  isPassenger?: boolean;
  password: string;
};

type Output = {
  accountId: string;
};

export class Signup {
  constructor(private accountRepository: AccountRepository, private logger: Logger) {}
  async execute(input: Input): Promise<Output> {
    this.logger.log(`Signup foi executado pelo usuário ${input.name}`);
    const existingAccount = await this.accountRepository.getByEmail(input.email);
    if (existingAccount) throw new Error("Duplicated account");
    const account = Account.create(input.name, input.email, input.cpf,  input.carPlate || "", !!input.isDriver, !!input.isPassenger);
    await this.accountRepository.save(account);
    return {
      accountId: account.accountId,
    };
  }
}
