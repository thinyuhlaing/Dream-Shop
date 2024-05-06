import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PORT = 5000;
const app = express();

app.use(express.static("public"));
app.use(express.static("private"));
app.use(bodyParser.urlencoded({ extended: true }));
let users: { username: string; email: string; password: string }[] = [];

try {
  const userData = fs.readFileSync("./data/users.json", "utf-8");
  users = JSON.parse(userData);
} catch (error) {
  users = [];
}

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/Home/index.html");
});

app.get("/output.css", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/Home/output.css");
});

app.get("/script.js", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/Home/script.js");
});

app.post("/signup", (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Email and passwrd are required");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = { username, email, password: hash };
  users.push(newUser);

  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

  res.redirect("/signin/signin.html");
});

app.post("/signin", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and passwrd are required");
  }

  const checkuser = users.find((user) => user.email === email);

  if (!checkuser) {
    return res.status(400).send("User not found");
  }

  const checkpwd = bcrypt.compareSync(password, checkuser.password); //

  if (!checkpwd) {
    return res.status(400).send("wrong password");
  }

  const token = jwt.sign({ email }, "EyCXSUHhVL5Xykn0QVix", {
    expiresIn: "1h",
  });

  res.cookie("token", token);
  res.redirect("/");
});

app.get("/cart", (req: Request, res: Response) => {
  console.log("Ok cart");

  res.send("OK Cart");
});

app.listen(PORT, () => console.log(`Server has started listening on ${PORT}`));
