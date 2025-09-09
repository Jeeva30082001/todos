import express from "express";
import bodyParser from "body-parser";
import { handler } from "./index.mjs";

const app = express();
app.use(bodyParser.json());

app.all("*", async (req, res) => {
  const event = {
    httpMethod: req.method,
    body: req.body ? JSON.stringify(req.body) : null,
  };

  const result = await handler(event);

  res.set(result.headers || {});
  res.status(result.statusCode || 200).send(result.body);
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
