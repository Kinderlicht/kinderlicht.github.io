import type { Activity } from "../components/horizontal_scroll";

export const ACTIVITY_REPORTS_URL =
  "https://portal.kinderlicht-wallersdorf.de/api/activity-reports";

export type ActivityReport = Activity;

const isActivityReport = (value: unknown): value is ActivityReport => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const report = value as Record<string, unknown>;

  return (
    typeof report.date === "string" &&
    typeof report.donation === "number" &&
    Number.isFinite(report.donation) &&
    typeof report.title === "string" &&
    typeof report.description === "string"
  );
};

export const parseActivityReports = (data: unknown): ActivityReport[] => {
  if (!Array.isArray(data) || !data.every(isActivityReport)) {
    throw new Error("Activity reports API returned an unexpected response.");
  }

  return data;
};

export const fetchActivityReports = async (
  fetcher: typeof fetch = fetch
): Promise<ActivityReport[]> => {
  const response = await fetcher(ACTIVITY_REPORTS_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Activity reports API responded with ${response.status} ${response.statusText}`
    );
  }

  return parseActivityReports(await response.json());
};
