import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { isToday } from "~/lib/functions";

import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export default function CalendarHeader({
  date,
  view = "month",
}: {
  date: Dayjs;
  view?: "year" | "month" | "week" | "day";
}) {
  return (
    <div className="order-1 flex w-full items-center justify-between gap-2 md:w-auto lg:justify-start">
      {/* Mês e ano */}
      <h4 className="mb-0 p-4 first-letter:capitalize">
        {view === "year" ? (
          date.format("YYYY")
        ) : view === "week" ? (
          `${getWrittenDate(date.startOf("week"))} a ${getWrittenDate(
            date.endOf("week")
          )}${
            isOnSameMonth(date.startOf("week"), date.endOf("week")) &&
            isOnSameYear(date.startOf("week"), date.endOf("week"))
              ? date.format(" [de] MMMM")
              : ""
          }`
        ) : view === "day" ? (
          <>
            {dayjs(date).format("DD [de] MMMM [de] YYYY")}
            {isToday(date) ? " (HOJE)" : ""}
          </>
        ) : (
          date.format("MMMM [de] YYYY")
        )}
      </h4>

      {/* Botões para mês e ano */}

      <div className="item-center flex">
        <Button link small icon squared asChild>
          <a
            href={
              view === "year"
                ? "./".concat(date.subtract(1, "year").format("YYYY-MM"))
                : view === "week"
                ? "./".concat(date.subtract(1, "week").format("YYYY-MM-DD"))
                : view === "day"
                ? `./${date.subtract(1, "day").format("DD-MM-YYYY")}`
                : "?month=".concat(date.subtract(1, "month").format("YYYY-MM"))
            }
          >
            <ChevronLeft />
          </a>
        </Button>
        <Button link small icon squared asChild>
          <a
            href={
              view === "year"
                ? "./".concat(date.add(1, "year").format("YYYY-MM"))
                : view === "week"
                ? "./".concat(date.add(1, "week").format("YYYY-MM-DD"))
                : view === "day"
                ? `./${date.add(1, "day").format("DD-MM-YYYY")}`
                : "?month=".concat(date.add(1, "month").format("YYYY-MM"))
            }
          >
            <ChevronRight />
          </a>
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xx font-bold tracking-widest">
        <Link
          className={
            view === "year" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/year/${dayjs().format("YYYY-MM")}`}
        >
          ANO
        </Link>
        <Link
          className={
            view === "month" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/?month=${dayjs().format("YYYY-MM")}`}
        >
          MÊS
        </Link>
        <Link
          className={
            view === "week" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/week/${dayjs().format("YYYY-MM-DD")}`}
        >
          SEMANA
        </Link>
        <Link
          className={
            view === "day" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/day/today`}
        >
          DIA
        </Link>
      </div>
    </div>
  );
}

function getWrittenDate(date: Dayjs) {
  return `${date.format("D")}${
    isOnSameYear(date.startOf("week"), date.endOf("week"))
      ? !isOnSameMonth(date.startOf("week"), date.endOf("week"))
        ? date.format(" [de] MMMM")
        : ""
      : date.format(" [de] MMMM [de] YYYY")
  }`;
}

function isOnSameYear(start: Dayjs, end: Dayjs) {
  return start.format("YYYY") === end.format("YYYY");
}

function isOnSameMonth(start: Dayjs, end: Dayjs) {
  return start.format("MM") === end.format("MM");
}
