import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

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

export const getYear = (currentDate: Dayjs) => {
  const firstDayOfCurrentYear = currentDate.startOf("year");
  type MonthType = Array<{
    date: Dayjs;
  }>;
  const year: Array<MonthType> = [];

  function getDaysOnMonth(month: number) {
    const Month = dayjs().month(month);
    const First = Month.startOf("month");
    const Last = Month.endOf("month");
    return Last.diff(First, "days") + 1;
  }

  for (let month = 0; month < 12; month++) {
    let current = firstDayOfCurrentYear.add(month, "month").clone();
    const Month: MonthType = [];
    for (let day = 0; day < getDaysOnMonth(month); day++) {
      Month.push({ date: current.add(day, "day") });
    }
    year.push(Month);
  }

  return { firstDayOfCurrentYear, year };
};
