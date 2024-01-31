import express, { Request, Response } from "express";
import { GetAccount } from "./GetAccount";
import { Signup } from "./Signup";
import AccountDAODatabase from "./AccountDAODatabase";
import { LoggerConsole } from "./LoggerConsole";

const app = express();

app.use(express.json());

app.post("/signup", async (request: Request, response: Response) => {
  try {
    const input = request.body;
    const accountDAO = new AccountDAODatabase();
    const logger = new LoggerConsole();
    const signup = new Signup(accountDAO, logger);
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
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const output = await getAccount.execute(accountId);
    response.json(output);
  }
);

app.listen(3000);
