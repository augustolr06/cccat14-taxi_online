import AccountDAO from "./AccountDAO";

export class GetAccount {
  accountDAO: AccountDAO;

  constructor() {
    this.accountDAO = new AccountDAO();
  }
  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
