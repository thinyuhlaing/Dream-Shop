import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect("/signin.html");
  }

  if (token) {
    return res.status(200).redirect("/cart.html");
  }

  jwt.verify(token, "EyCXSUHhVL5Xykn0QVix", (err) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }

    next();
  });
};
