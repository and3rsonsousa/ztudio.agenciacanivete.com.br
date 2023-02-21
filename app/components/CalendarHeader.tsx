import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { Link } from "@remix-run/react";

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
        {view === "year"
          ? date.format("YYYY")
          : view === "week"
          ? `${getWrittenDate(date.startOf("week"))} a ${getWrittenDate(
              date.endOf("week")
            )}${
              isOnSameMonth(date.startOf("week"), date.endOf("week")) &&
              isOnSameYear(date.startOf("week"), date.endOf("week"))
                ? date.format(" [de] MMMM")
                : ""
            }`
          : date.format("MMMM [de] YYYY")}
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
          to={`/dashboard/year/${""}`}
        >
          ANO
        </Link>
        <Link
          className={
            view === "month" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/${""}`}
        >
          MÊS
        </Link>
        <Link
          className={
            view === "week" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/week/${""}`}
        >
          SEMANA
        </Link>
        <Link
          className={
            view === "day" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`/dashboard/day/${""}`}
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
