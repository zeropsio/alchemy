import * as Contributions from "alchemy/Contributions";
export default Contributions.make({
  name: "zerops",
  auth: Contributions.lazy(
    () => import("./AuthProvider.ts"),
    (module) => module.ZeropsAuth,
  ),
});
