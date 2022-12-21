import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link, useMatches, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react";
import { getPeriod, getYear } from "~/lib/functions";
import type {
  ActionModel,
  CampaignModel,
  CelebrationModel,
  DayModel,
  MonthType,
} from "~/lib/models";
import Button from "./Button";
import Day from "./Day";
import DayInfo from "./DayInfo";
import InstagramGrid from "./InstagramGrid";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("pt-br");

export default function Calendar({
  actions,
  campaigns,

  grid,
}: {
  actions: ActionModel[];
  campaigns: CampaignModel[];

  grid?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const currentMonth = searchParams.get("month");
  const currentYear = searchParams.get("year");
  const showYearView = currentYear !== null;
  const matches = useMatches();
  let height = 0;
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  const today = dayjs();

  const { firstDayOfCurrentMonth, days: newDays } = getPeriod({
    period: currentMonth ?? currentYear,
  });

  let [selectedDay, setSelectedDay] = useState(today.format("YYYY-MM-DD"));

  const days = newDays.map((day) => {
    let _day: DayModel = {
      date: day,
      actions: [],
      celebrations: [],
      campaigns: [],
    };
    _day.actions = actions.filter((action) => {
      return (
        dayjs(action.date).format("YYYY-MM-DD") ===
        _day.date.format("YYYY-MM-DD")
      );
    });

    _day.celebrations = celebrations.filter((celebration) => {
      return (
        _day.date.format("MM-DD") === dayjs(celebration.date).format("MM-DD")
      );
    });
    _day.campaigns = campaigns.filter((campaign) => {
      return (
        day.isSameOrAfter(dayjs(campaign.date_start), "day") &&
        day.isSameOrBefore(dayjs(campaign.date_end), "day")
      );
    });
    return _day;
  });

  const { year } = getYear(firstDayOfCurrentMonth);

  useEffect(() => {
    if (window) {
      document
        .querySelector(`div[date-attr="${dayjs().format("YYYY-MM-DD")}"]`)
        ?.scrollIntoView();
    }
  }, []);

  return (
    <div className="calendar overflow-hidden lg:flex lg:h-full lg:flex-auto lg:flex-col">
      {/* header */}
      <div className="flex items-center justify-between ">
        <div className="flex w-full items-center justify-between gap-2 lg:justify-start">
          <h4 className="mb-0 p-4 first-letter:capitalize">
            {showYearView
              ? firstDayOfCurrentMonth.format("YYYY")
              : firstDayOfCurrentMonth.format(`MMMM [de] YYYY`)}
          </h4>

          <div className="item-center flex">
            <Button link small icon squared asChild>
              <a
                href={(showYearView ? "?year=" : "?month=").concat(
                  firstDayOfCurrentMonth
                    .subtract(1, showYearView ? "year" : "month")
                    .format("YYYY-MM")
                )}
              >
                <ChevronLeftIcon />
              </a>
            </Button>
            <Button asChild link small>
              <a
                href={(showYearView ? "?month=" : "?year=").concat(
                  firstDayOfCurrentMonth.format("YYYY-MM")
                )}
                className="uppercase"
              >
                {showYearView
                  ? firstDayOfCurrentMonth.format("MMMM [de] YYYY")
                  : firstDayOfCurrentMonth.format("YYYY")}
              </a>
            </Button>
            <Button link small icon squared asChild>
              <a
                href={(showYearView ? "?year=" : "?month=").concat(
                  firstDayOfCurrentMonth
                    .add(1, showYearView ? "year" : "month")
                    .format("YYYY-MM")
                )}
              >
                <ChevronRightIcon />
              </a>
            </Button>
          </div>
        </div>
        <div></div>
      </div>
      {showYearView ? (
        <YearView year={year} />
      ) : (
        <div className="h-full overflow-hidden lg:flex">
          {/* Calendar  */}

          <div className="flex w-full flex-col ">
            <div className="grid grid-cols-7 rounded-xl bg-gray-100 dark:bg-gray-900">
              {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                (day, index) => (
                  <div key={index} className="calendar-weekday">
                    {day}
                  </div>
                )
              )}
            </div>
            <div className="no-scrollbars grid flex-auto grid-cols-7 overflow-hidden overflow-y-auto">
              {days.map((day, index) => {
                if (index % 7 === 0) {
                  height = 0;
                  for (let i = index; i < index + 7; i++) {
                    if (days[i].campaigns.length > height) {
                      height = days[i].campaigns.length;
                    }
                  }
                }

                return (
                  <Day
                    key={index}
                    day={day}
                    height={height}
                    firstDayOfCurrentMonth={firstDayOfCurrentMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                  />
                );
              })}
            </div>
          </div>
          {/* Info */}

          {grid ? (
            <InstagramGrid actions={actions} />
          ) : (
            <DayInfo
              day={
                days.filter(
                  (day) =>
                    day.date.format("YYYY-MM-DD") ===
                    dayjs(selectedDay).format("YYYY-MM-DD")
                )[0]
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

const YearView = ({ year }: { year: MonthType[] }) => {
  const matches = useMatches();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;

  return (
    <div className="h-full overflow-hidden  lg:flex">
      <div className="grid w-full grid-cols-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
        {year.map((month, index) => (
          <div key={index} className="col-span-1 flex flex-col p-4">
            <div className="pb-4 text-center font-semibold first-letter:capitalize">
              <Link to={`?month=${month[0].date.format("YYYY-MM")}`}>
                {month[0].date.format("MMMM")}
              </Link>
            </div>
            <div className="grid w-full flex-auto grid-cols-7 text-center text-xs md:text-sm">
              {month.map((day, index) => (
                <div
                  key={index}
                  className={`col-span-1 `}
                  style={{ gridColumnStart: day.date.day() + 1 }}
                >
                  <div
                    data-date={day.date.format("MM/DD")}
                    className={`grid h-6 w-6 place-items-center md:h-8 md:w-8 ${
                      celebrations.filter(
                        (celebration) =>
                          day.date.format("MM/DD") === celebration.date &&
                          celebration.is_holiday
                      ).length
                        ? "rounded-full bg-gray-200 font-medium dark:bg-gray-700"
                        : ""
                    } ${
                      day.date.format("YYYY-MM-DD") ===
                      dayjs().format("YYYY-MM-DD")
                        ? " rounded-full bg-brand font-semibold text-white"
                        : ""
                    }`}
                  >
                    {day.date.format("D")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
