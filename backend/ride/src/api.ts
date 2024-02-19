import express, { Request, Response } from "express";
import { GetAccount } from "./GetAccount";
import { Signup } from "./Signup";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import { LoggerConsole } from "./LoggerConsole";

const app = express();

app.use(express.json());

app.post("/signup", async (request: Request, response: Response) => {
  try {
    const input = request.body;
    const accountRepository = new AccountRepositoryDatabase();
    const logger = new LoggerConsole();
    const signup = new Signup(accountRepository, logger);
    const output = await signup.execute(input);
    response.json(output);
  } catch (e: any) {
    response.status(422).json({
      message: e.message,
    });
  }
});

app.get(
  "/accounts/:accountId",
  async (request: Request, response: Response) => {
    const { accountId } = request.params;
    const accountRepository = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountRepository);
    const output = await getAccount.execute(accountId);
    response.json(output);
  }
);

app.listen(3000);
