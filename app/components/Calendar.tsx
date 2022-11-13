import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMatches, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { getPeriod } from "~/lib/functions";
import type { ActionModel, CelebrationModel, DayModel } from "~/lib/models";
import Day from "./Day";
import DayInfo from "./DayInfo";
import Button from "./Forms/Button";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

export default function Calendar({ actions }: { actions: ActionModel[] }) {
  const matches = useMatches();
  const [searchParams] = useSearchParams();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  const today = dayjs();
  const period = searchParams.get("period");

  const {
    firstDayOfPeriod,
    firstDayOfCurrentMonth,
    days: newDays,
  } = getPeriod({ period });

  let [selectedDay, setSelectedDay] = useState(today.format("YYYY-MM-DD"));

  // let [currentMonth, setCurrentMonth] = useState(
  //   dayjs(period ?? new Date()).format("YYYY-MM")
  // );
  // let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", parseISO());

  // let newDays = eachDayOfInterval({
  //   start: startOfWeek(startOfMonth(firstDayOfCurrentMonth)),
  //   end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  // });

  const days = newDays.map((day) => {
    let _day: DayModel = { date: day, actions: [], celebrations: [] };
    _day.actions = actions.filter((action) => {
      return (
        dayjs(action.date).format("YYYY-MM-DD") ===
        _day.date.format("YYYY-MM-DD")
      );
    });
    // _day.celebrations = celebrations.filter((celebration) => {
    //   return (
    //     _day.date.format("YYYY-MM-DD") ===
    //     dayjs(celebration.date_start).format("YYYY-MM-DD")
    //   );
    // });
    return _day;
  });

  // function changeMonth(value: number) {
  //   if (value !== 0) {
  //     let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: value });
  //     setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  //   }
  // }

  // function setSelectedDayAndCurrentMonth(day: string) {
  // setSelectedDay(day);
  // Ao escolher o dia define também o mês
  // Ex: Caso seja mês de agosto, e escolha uma data de setembro ou de julho
  // EX: o mês muda para o da data selecionada
  // changeMonth(getMonth(day) - getMonth(firstDayOfCurrentMonth));
  // }

  return (
    <div className="calendar lg:flex lg:h-full lg:flex-auto lg:flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h4 className="mb-0 p-4 first-letter:capitalize">
            {firstDayOfCurrentMonth.format(`MMMM [de] YYYY`)}
          </h4>
          <div>
            <Button link small onClick={() => {}}>
              <ChevronLeftIcon />
            </Button>
            <Button link small onClick={() => {}}>
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
            {days.map((day, index) => (
              <Day
                key={index}
                day={day}
                firstDayOfCurrentMonth={firstDayOfCurrentMonth}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />
            ))}
          </div>
        </div>
        {/* Info */}

        <DayInfo
          day={
            days.filter(
              (day) =>
                day.date.format("YYYY-MM-DD") ===
                dayjs(selectedDay).format("YYYY-MM-DD")
            )[0]
          }
        />
      </div>
    </div>
  );
}
