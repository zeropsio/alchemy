import { test, expect } from "bun:test";
import { apiError, isNotFound } from "../../src/client/Errors.ts";
test("recorded nested HTTP 400 projectNotFound retains code", () => {
  const e = apiError(
    400,
    { error: { code: "projectNotFound", message: "secret-value" } },
    "GET project",
  );
  expect(e._tag).toBe("ZeropsNotFound");
  expect(isNotFound(e, "projectNotFound")).toBe(true);
  expect(e.message).not.toContain("secret-value");
  expect(isNotFound(e, "serviceStackNotFound")).toBe(false);
});
test("HTTP 403 processNotFound remains a permission failure", () => {
  const error = apiError(403, { code: "processNotFound" }, "GET process");
  expect(error.code).toBe("processNotFound");
  expect(error._tag).toBe("ZeropsForbidden");
  expect(isNotFound(error, "processNotFound")).toBe(false);
});
test("notAvailable is never transient server error", () =>
  expect(apiError(503, { error: { code: "notAvailable" } }, "PUT start")._tag).toBe(
    "ZeropsNotAvailable",
  ));
test("permission and duplicate classification", () => {
  expect(apiError(403, { code: "notInSudoMode" }, "GET")._tag).toBe("ZeropsForbidden");
  expect(apiError(400, { code: "userDataDuplicateKey" }, "POST")._tag).toBe("ZeropsConflict");
});
test("entity absence requires HTTP 400 and the caller's exact code", () => {
  for (const code of [
    "projectNotFound",
    "serviceStackNotFound",
    "projectEnvNotFound",
    "userDataNotFound",
    "publicHttpRoutingNotFound",
    "publicPortRoutingNotFound",
    "appVersionNotFound",
    "processNotFound",
  ]) {
    expect(isNotFound(apiError(400, { error: { code } }, "GET"), code)).toBe(true);
    for (const status of [401, 403, 404, 429, 500, 503]) {
      const error = apiError(status, { error: { code } }, "GET");
      expect(isNotFound(error, code)).toBe(false);
      expect(error._tag).not.toBe("ZeropsNotFound");
    }
    expect(isNotFound({ code }, code)).toBe(false);
    expect(isNotFound({ status: "400", code }, code)).toBe(false);
  }
  expect(isNotFound(apiError(404, { code: "notFound" }, "GET"), "projectNotFound")).toBe(false);
  expect(isNotFound(apiError(400, { code: "otherNotFound" }, "GET"), "projectNotFound")).toBe(
    false,
  );
});
