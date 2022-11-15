import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMatches, useNavigate, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { getPeriod } from "~/lib/functions";
import type {
  ActionModel,
  CampaignModel,
  CelebrationModel,
  DayModel,
} from "~/lib/models";
import InstagramGrid from "./InstagramGrid";
import Day from "./Day";
import DayInfo from "./DayInfo";
import Button from "./Forms/Button";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
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
  const matches = useMatches();
  const [searchParams] = useSearchParams();
  let height = 0;
  let lastCampaign: string;
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  const today = dayjs();
  const period = searchParams.get("period");

  const { firstDayOfCurrentMonth, days: newDays } = getPeriod({ period });

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

  const navigate = useNavigate();

  return (
    <div className="calendar overflow-hidden lg:flex lg:h-full lg:flex-auto lg:flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b dark:border-gray-800">
        <div className="flex w-full items-center justify-between gap-2 lg:justify-start">
          <h4 className="mb-0 w-60 p-4 first-letter:capitalize">
            {firstDayOfCurrentMonth.format(`MMMM [de] YYYY`)}
          </h4>
          <div>
            <Button
              link
              small
              icon
              onClick={() => {
                navigate(
                  `?period=${firstDayOfCurrentMonth
                    .subtract(1, "month")
                    .format("YYYY-MM")}`
                );
              }}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              link
              small
              icon
              onClick={() => {
                navigate(
                  `?period=${firstDayOfCurrentMonth
                    .add(1, "month")
                    .format("YYYY-MM")}`
                );
              }}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
        <div></div>
      </div>

      <div className="h-full overflow-hidden lg:flex">
        {/* Calendar  */}
        <div className="flex w-full flex-col dark:border-gray-800 lg:border-r">
          <div className="grid grid-cols-7 border-b dark:border-gray-800">
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
                  index={index}
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
    </div>
  );
}
