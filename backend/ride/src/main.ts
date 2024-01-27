import crypto from "crypto";
import pgp from "pg-promise";
import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

app.post("/signup", async (request: Request, response: Response) => {
  try {
    const input = request.body;
    const output = await signup(input);
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
    const output = await getAccount(accountId);
    response.json(output);
  }
);

app.listen(3000);

function isValidCpf(cpf: string) {
  if (!cpf) return false;
  cpf = cleanCpf(cpf);
  if (isInvalidCpfLength(cpf)) return false;
  if (allCpfDigitsAreTheSame(cpf)) return false;
  const dg1 = calculateDigit(cpf, 10);
  const dg2 = calculateDigit(cpf, 11);
  return extractCpfCheckDigit(cpf) == `${dg1}${dg2}`;
}

function cleanCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isInvalidCpfLength(cpf: string) {
  return cpf.length !== 11;
}

function allCpfDigitsAreTheSame(cpf: string) {
  return cpf.split("").every((character) => character === cpf[0]);
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractCpfCheckDigit(cpf: string) {
  return cpf.slice(9);
}

async function signup(input: any): Promise<any> {
  const connection = pgp()(
    "postgres://postgres:postgres@localhost:5432/cccat14-taxi_online"
  );
  try {
    const accountId = crypto.randomUUID();
    const [account] = await connection.query(
      "select * from cccat14.account where email = $1",
      [input.email]
    );
    if (account) throw new Error("Duplicated account");
    if (!isValidName(input.name)) throw new Error("Invalid name");
    if (!isValidEmail(input.email)) throw new Error("Invalid email");
    if (!isValidCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !isValidCarPlate(input.carPlate))
      throw new Error("Invalid car plate");
    await connection.query(
      "insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        accountId,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ]
    );
    return {
      accountId,
    };
  } finally {
    await connection.$pool.end();
  }
}

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail(email: string) {
  return email.match(/^(.+)@(.+)$/);
}

function isValidCarPlate(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

async function getAccount(accountId: string) {
  const connection = pgp()(
    "postgres://postgres:postgres@localhost:5432/cccat14-taxi_online"
  );
  const [account] = await connection.query(
    "select * from cccat14.account where account_id = $1",
    [accountId]
  );
  await connection.$pool.end();
  return account;
}
