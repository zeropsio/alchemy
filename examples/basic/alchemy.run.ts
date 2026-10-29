import * as Alchemy from "alchemy";
import * as Zerops from "../../src/index.ts";
import { basic } from "./stack.ts";

export default Alchemy.Stack(
  "ZeropsBasic",
  {
    providers: Zerops.providers(),
    state: Alchemy.localState(),
  },
  basic({
    name: process.env.ZEROPS_PROJECT_NAME,
    domain: process.env.ZEROPS_DOMAIN ?? "alchemy-basic.example.com",
    greeting: process.env.GREETING ?? "Hello from Alchemy and Zerops!",
  }),
);
