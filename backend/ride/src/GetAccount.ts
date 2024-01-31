import AccountDAO from "./AccountDAO";

export class GetAccount {
  constructor(private accountDAO: AccountDAO) {}
  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
