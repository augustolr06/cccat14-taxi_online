import express, { Request, Response } from "express";
import { GetAccount } from "./GetAccount";
import { Signup } from "./Signup";

const app = express();

app.use(express.json());

app.post("/signup", async (request: Request, response: Response) => {
  const signup = new Signup();
  try {
    const input = request.body;
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
    const getAccount = new GetAccount();
    const { accountId } = request.params;
    const output = await getAccount.execute(accountId);
    response.json(output);
  }
);

app.listen(3000);
