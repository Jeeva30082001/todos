import { handler } from "./index.mjs";

const event = {
  httpMethod: "POST",
  body: JSON.stringify({ id: "1", task: "Learn AWS" }),
};

handler(event).then((res) => console.log(res));
