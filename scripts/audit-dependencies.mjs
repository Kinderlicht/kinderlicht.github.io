import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// CVE-2026-93753 was rejected by its CNA on 2026-11-02. See README.md.
const REJECTED_ADVISORY = "https://github.com/advisories/GHSA-gcqx-w48m-w2h4";

export function findBlockingVulnerabilities(report) {
  if (
    report?.error ||
    report?.auditReportVersion !== 2 ||
    !report.vulnerabilities ||
    typeof report.vulnerabilities !== "object" ||
    Array.isArray(report.vulnerabilities)
  ) {
    throw new Error("npm audit returned an error or an unsupported report.");
  }

  const vulnerabilities = report.vulnerabilities;
  return Object.keys(vulnerabilities).filter((name) => {
    const pending = [name];
    const visited = new Set();
    let foundRejectedAdvisory = false;

    // Follow npm's transitive findings, including Gatsby's dependency cycles.
    // Every reachable advisory must match the single exception exactly.
    while (pending.length > 0) {
      const dependency = pending.pop();
      if (visited.has(dependency)) continue;
      visited.add(dependency);
      const finding = vulnerabilities[dependency];
      if (!Array.isArray(finding?.via) || finding.via.length === 0) return true;

      for (const via of finding.via) {
        if (typeof via === "string") {
          pending.push(via);
        } else if (
          dependency === "deepmerge" &&
          finding.severity === "low" &&
          via?.name === "deepmerge" &&
          via.dependency === "deepmerge" &&
          via.url === REJECTED_ADVISORY &&
          via.severity === "low"
        ) {
          foundRejectedAdvisory = true;
        } else {
          return true;
        }
      }
    }

    // An unexplained finding (including a cycle without an advisory) must fail.
    return !foundRejectedAdvisory;
  });
}

function main() {
  const npm = process.env.npm_execpath;
  const result = spawnSync(
    npm ? process.execPath : "npm",
    [...(npm ? [npm] : []), "audit", "--json"],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, timeout: 120_000 },
  );
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(`npm audit failed (status ${result.status}).`);
  }

  const report = JSON.parse(result.stdout);
  const blocking = findBlockingVulnerabilities(report);
  const ignored = Object.keys(report.vulnerabilities).length - blocking.length;
  if (ignored > 0) {
    console.log(
      `Excluded ${ignored} package findings caused only by rejected advisory ${REJECTED_ADVISORY}.`,
    );
  }
  for (const name of blocking) {
    console.error(JSON.stringify(report.vulnerabilities[name], null, 2));
  }
  console.log(
    `Dependency audit: ${blocking.length} blocking package findings.`,
  );
  process.exitCode = blocking.length > 0 ? 1 : 0;
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  try {
    main();
  } catch (error) {
    console.error(`Dependency audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
