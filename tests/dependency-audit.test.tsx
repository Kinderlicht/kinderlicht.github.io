import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { findBlockingVulnerabilities } from "../scripts/audit-dependencies.mjs";

const rejected = {
  name: "deepmerge",
  dependency: "deepmerge",
  url: "https://github.com/advisories/GHSA-gcqx-w48m-w2h4",
  severity: "low",
};
const finding = (via: unknown[], severity = "low") => ({ via, severity });
const report = (vulnerabilities = {}) => ({
  auditReportVersion: 2,
  vulnerabilities,
});

test("audit accepts a clean report and only the rejected advisory's dependency chain", () => {
  assert.deepEqual(findBlockingVulnerabilities(report()), []);
  assert.deepEqual(
    findBlockingVulnerabilities(
      report({
        deepmerge: finding([rejected]),
        gatsby: finding(["deepmerge", "gatsby-plugin-utils"]),
        "gatsby-plugin-utils": finding(["gatsby"]),
        "react-dev-utils": finding(["deepmerge"]),
      }),
    ),
    [],
  );
});

test("audit blocks new advisories of every severity, including on deepmerge", () => {
  for (const severity of ["low", "moderate", "high", "critical"]) {
    const newAdvisory = {
      ...rejected,
      url: "https://example.org/new-advisory",
      severity,
    };
    assert.deepEqual(
      findBlockingVulnerabilities(
        report({
          deepmerge: finding([rejected, newAdvisory]),
          gatsby: finding(["deepmerge", "gatsby-plugin-utils"]),
          "gatsby-plugin-utils": finding(["gatsby"]),
        }),
      ),
      ["deepmerge", "gatsby", "gatsby-plugin-utils"],
    );
  }
  assert.deepEqual(
    findBlockingVulnerabilities(
      report({
        deepmerge: finding([rejected]),
        joi: finding([{ name: "joi", severity: "high" }], "high"),
        gatsby: finding(["deepmerge", "joi"]),
      }),
    ),
    ["joi", "gatsby"],
  );
});

test("audit exception requires the exact package, advisory, and severity", () => {
  for (const changed of [
    { name: "other" },
    { dependency: "other" },
    { severity: "high" },
  ]) {
    assert.deepEqual(
      findBlockingVulnerabilities(
        report({ deepmerge: finding([{ ...rejected, ...changed }]) }),
      ),
      ["deepmerge"],
    );
  }
});

test("audit fails closed on missing dependency paths and unexplained cycles", () => {
  assert.deepEqual(
    findBlockingVulnerabilities(
      report({
        missing: finding(["absent"]),
        empty: finding([]),
        cycle: finding(["cycle"]),
      }),
    ),
    ["missing", "empty", "cycle"],
  );
  for (const invalid of [
    null,
    {},
    { error: "registry unavailable" },
    { ...report(), auditReportVersion: 1 },
  ]) {
    assert.throws(() => findBlockingVulnerabilities(invalid));
  }
});

test("audit CLI preserves failures and accepts only valid, reviewed reports", async () => {
  const directory = await mkdtemp(
    path.join(tmpdir(), "kinderlicht-audit-test-"),
  );
  const npmStub = path.join(directory, "npm.cjs");
  try {
    for (const [stdout, npmStatus, expectedStatus] of [
      [JSON.stringify(report()), 0, 0],
      [JSON.stringify(report({ deepmerge: finding([rejected]) })), 1, 0],
      [
        JSON.stringify(report({ joi: finding([{ name: "joi" }], "high") })),
        1,
        1,
      ],
      [
        JSON.stringify({
          ...report(),
          error: { message: "registry unavailable" },
        }),
        1,
        1,
      ],
      ["not JSON", 1, 1],
      [JSON.stringify(report()), 2, 1],
    ] as const) {
      await writeFile(
        npmStub,
        `process.stdout.write(${JSON.stringify(stdout)}); process.exitCode = ${npmStatus};`,
      );
      const result = spawnSync(
        process.execPath,
        ["scripts/audit-dependencies.mjs"],
        {
          encoding: "utf8",
          env: { ...process.env, npm_execpath: npmStub },
        },
      );
      assert.equal(
        result.status,
        expectedStatus,
        result.stderr || result.stdout,
      );
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
