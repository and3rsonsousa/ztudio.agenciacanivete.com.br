import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Fortaleza");

export const getPeriod = ({ period }: { period?: string | null }) => {
  const day = dayjs(period ?? new Date());

  const firstDayOfCurrentMonth = day.startOf("month");
  const lastDayOfCurrentMonth = day.endOf("month");
  const firstDayOfPeriod = firstDayOfCurrentMonth.startOf("week");
  const lastDayOfPeriod = lastDayOfCurrentMonth.endOf("week");
  const days: Array<Dayjs> = [];
  const diffDays = lastDayOfPeriod.diff(firstDayOfPeriod, "days") + 1;

  for (let index = 0; index < diffDays; index++) {
    days.push(firstDayOfPeriod.add(index, "day"));
  }

  return {
    firstDayOfCurrentMonth,
    lastDayOfCurrentMonth,
    firstDayOfPeriod,
    lastDayOfPeriod,
    days,
  };
};
