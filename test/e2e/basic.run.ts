import * as Alchemy from "alchemy";
import * as Zerops from "../../src/index.ts";
import { basic } from "../../examples/basic/stack.ts";
import { createAuditedGuard } from "./audit.ts";

const name = process.env.ALCHTEST_NAME;
const domain = process.env.ALCHTEST_DOMAIN;
if (!name?.startsWith("alchtest-")) throw new Error("ALCHTEST_NAME must start with alchtest-");
if (!domain) throw new Error("ALCHTEST_DOMAIN is required");
export default Alchemy.Stack(
  "ZeropsBasicE2E",
  {
    providers: Zerops.providers({ requestGuard: createAuditedGuard() }),
    state: Alchemy.localState(),
  },
  basic({
    name,
    domain,
    greeting: process.env.ALCHTEST_GREETING ?? "Hello smoke!",
    sourceDir: process.env.ALCHTEST_SOURCE_DIR,
    productionSmall: process.env.ZEROPS_TARGET === "prod",
  }),
);
