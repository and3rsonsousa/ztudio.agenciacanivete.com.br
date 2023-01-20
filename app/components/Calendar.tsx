import {
  CheckCircleIcon,
  FunnelIcon as FunnelIconSolid,
  Square3Stack3DIcon as Square3Stack3DIconSolid,
  BellAlertIcon as BellAlertIconSolid,
  ClockIcon as ClockIconSolid,
} from "@heroicons/react/20/solid";
import {
  BellAlertIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FunnelIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Link,
  useMatches,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react";
import { SHORTCUTS } from "~/lib/constants";
import { getPeriod, getYear } from "~/lib/functions";
import type {
  ActionModel,
  CampaignModel,
  CelebrationModel,
  ContextType,
  DayModel,
  ItemModel,
  MonthType,
} from "~/lib/models";
import Button from "./Button";
import DataFlow from "./DataFlow";
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
  const { slug } = useParams();
  const context: ContextType = useOutletContext();

  const currentMonth = searchParams.get("month");
  const currentYear = searchParams.get("year");
  const showYearView = currentYear !== null;
  const matches = useMatches();
  let height = 0;
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  const tags: ItemModel[] = matches[1].data.tags;
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
          _day.date.format("YYYY-MM-DD") &&
        (context.filter.option === "all" ||
          action.tag.slug === context.filter.option)
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
  let arrangeDropdownItems = [
    {
      title: SHORTCUTS.ARRANGE_ALL.does,
      value: SHORTCUTS.ARRANGE_ALL.value,
      shortcut: SHORTCUTS.ARRANGE_ALL.shortcut,
    },
    {
      title: SHORTCUTS.ARRANGE_CATEGORIES.does,
      value: SHORTCUTS.ARRANGE_CATEGORIES.value,
      shortcut: SHORTCUTS.ARRANGE_CATEGORIES.shortcut,
    },
  ];
  if (!slug)
    arrangeDropdownItems.push({
      title: SHORTCUTS.ARRANGE_ACCOUNTS.does,
      value: SHORTCUTS.ARRANGE_ACCOUNTS.value,
      shortcut: SHORTCUTS.ARRANGE_ACCOUNTS.shortcut,
    });

  useEffect(() => {
    if (window) {
      document
        .querySelector(`div[date-attr="${dayjs().format("YYYY-MM-DD")}"]`)
        ?.scrollIntoView();
    }
  }, []);

  return (
    <div className="calendar lg:flex lg:h-full lg:flex-auto lg:flex-col lg:overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between md:flex-nowrap">
        <div className="order-1 flex w-full items-center justify-between gap-2 md:w-auto lg:justify-start">
          {/* Mês e ano */}
          <h4 className="mb-0 p-4 first-letter:capitalize">
            {firstDayOfCurrentMonth.format("MMMM")}
          </h4>

          {/* Botões para mês e ano */}

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

        <div className="order-3 md:order-2">
          <DataFlow actions={actions} />
        </div>

        <div className="order-2 flex gap-1 px-4 md:order-3">
          <label className={`flex cursor-pointer gap-2`}>
            <input
              type="checkbox"
              className="hidden"
              checked={context.priority.option}
              onChange={() => context.priority.set((prev) => !prev)}
            />
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl md:h-10 md:w-10 ${
                context.priority.option
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Cmd + K → O ( Ordenar por prioridade de status )"
            >
              {context.priority.option ? (
                <BellAlertIconSolid className="w-5" />
              ) : (
                <BellAlertIcon className="w-5" />
              )}
            </div>
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl md:h-10 md:w-10  ${
                !context.priority.option
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Cmd K → O ( Ordenar por horário de conclusão )"
            >
              {!context.priority.option ? (
                <ClockIconSolid className={`w-5`} />
              ) : (
                <ClockIcon className={`w-5`} />
              )}
            </div>
          </label>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={`grid h-8 w-8 place-items-center rounded-lg dark:hover:text-white md:h-10 md:w-10 ${
                context.arrange.option !== "arrange_all"
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Agrupar Ações"
            >
              {context.arrange.option !== "arrange_all" ? (
                <Square3Stack3DIconSolid className="w-5" />
              ) : (
                <Square3Stack3DIcon className="w-5" />
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                {arrangeDropdownItems.map((item, index) => (
                  <DropdownMenu.Item
                    key={index}
                    title={`Cmd + K → ${item.shortcut}`}
                    className="dropdown-item item-small flex justify-between gap-4"
                    onSelect={() => {
                      if (
                        context.filter.option !== "all" &&
                        item.value === "arrange_category"
                      ) {
                        context.filter.set("all");
                      }
                      context.arrange.set(item.value);
                    }}
                  >
                    {item?.title.substring(item.title.indexOf(" ") + 1)}
                    {context.arrange.option === item.value && (
                      <CheckCircleIcon className="w-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={`grid h-8 w-8 place-items-center rounded-lg text-gray-400 dark:hover:text-white md:h-10 md:w-10 bg-${context.filter.option}`}
            >
              {context.filter.option !== "all" ? (
                <FunnelIconSolid className="w-5" />
              ) : (
                <FunnelIcon className="w-5" />
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                <DropdownMenu.Item
                  className="dropdown-item item-small flex justify-between gap-4"
                  onSelect={() => {
                    context.filter.set("all");
                  }}
                  title={`Cmd + K → 0`}
                >
                  Todos
                  {context.filter.option === "all" && (
                    <CheckCircleIcon className="w-4" />
                  )}
                </DropdownMenu.Item>
                {tags.map((tag, index) => (
                  <DropdownMenu.Item
                    key={index}
                    title={`Cmd + K → ${index + 1}`}
                    className="dropdown-item item-small flex justify-between gap-4"
                    onSelect={() => {
                      if (context.arrange.option === "arrange_category") {
                        context.arrange.set("arrange_all");
                      }
                      context.filter.set(tag.slug);
                    }}
                  >
                    {tag.name}
                    {context.filter.option === tag.slug && (
                      <CheckCircleIcon className="w-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      {showYearView ? (
        <YearView year={year} />
      ) : (
        <div className=" h-full overflow-hidden lg:flex">
          {/* Calendar  */}

          <div className="relative flex w-full flex-col">
            <div className="relative grid grid-cols-7 rounded-xl">
              {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                (day, index) => (
                  <div key={index} className="calendar-weekday">
                    {day}
                  </div>
                )
              )}
              <div className="absolute left-0 right-0 bottom-0 h-[1px]  bg-gradient-to-r from-transparent dark:via-gray-700"></div>
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
                    arrange={context.arrange.option}
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
