import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";
import * as Zerops from "../../../../src/index.ts";
import { createGuardFromEnv } from "../../../support/guard.ts";
export default Alchemy.Stack(
  "ZeropsProjectLive",
  {
    providers: Zerops.providers({ requestGuard: createGuardFromEnv() }),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const project = yield* Zerops.Project("Project", {
      name: process.env.ALCHTEST_NAME!,
      organizationId: process.env.ZEROPS_ORGANIZATION_ID!,
      mode: "LIGHT",
      description: process.env.ALCHTEST_DESCRIPTION ?? "initial",
      tags: JSON.parse(process.env.ALCHTEST_TAGS ?? '["live"]'),
    });
    return { projectId: project.projectId };
  }),
);
