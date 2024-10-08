import express from "express";
import "dotenv/config";
const app = express();
import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.js";

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Hello World!");
});

import { StatusCodes } from "http-status-codes";

app.use(notFound);
app.use(errorHandler);

export default app;
