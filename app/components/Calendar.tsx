import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMatches } from "@remix-run/react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  setDefaultOptions,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { ActionModel, CelebrationModel, DayModel } from "~/lib/models";
import Day from "./Day";
import DayInfo from "./DayInfo";
import Button from "./Forms/Button";

export default function Calendar({ actions }: { actions: ActionModel[] }) {
  setDefaultOptions({ locale: ptBR });
  const matches = useMatches();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyy"));
  let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let newDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayOfCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  const days = newDays.map((day) => {
    let _day: DayModel = { date: day, actions: [], celebrations: [] };
    _day.actions = actions.filter((action) => {
      return (
        format(new Date(action.date), "y-M-d") ===
        format(new Date(_day.date), "y-M-d")
      );
    });
    _day.celebrations = celebrations.filter((celebration) => {
      return (
        format(new Date(_day.date), "dd-MM") ===
        format(new Date(celebration.date), "dd-MM")
      );
    });
    return _day;
  });

  function changeMonth(value: number) {
    if (value !== 0) {
      let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: value });
      setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    }
  }

  function setSelectedDayAndCurrentMonth(day: Date) {
    setSelectedDay(day);
    // Ao escolher o dia define também o mês
    // Ex: Caso seja mês de agosto, e escolha uma data de setembro ou de julho
    // EX: o mês muda para o da data selecionada
    // changeMonth(getMonth(day) - getMonth(firstDayOfCurrentMonth));
  }

  return (
    <div className="calendar lg:flex lg:h-full lg:flex-auto lg:flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b dark:border-gray-800">
        <h4 className="mb-0 p-4 first-letter:capitalize">
          {format(firstDayOfCurrentMonth, `MMMM 'de' Y`)}
        </h4>
        <div>
          <Button link onClick={() => changeMonth(-1)}>
            <ChevronLeftIcon />
          </Button>
          <Button link onClick={() => changeMonth(1)}>
            <ChevronRightIcon />
          </Button>
        </div>
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
                setSelectedDayAndCurrentMonth={setSelectedDayAndCurrentMonth}
              />
            ))}
          </div>
        </div>
        {/* Info */}

        <DayInfo
          day={
            days.filter(
              (day) =>
                format(day.date, "y-M-d") === format(selectedDay, "y-M-d")
            )[0]
          }
        />
      </div>
    </div>
  );
}
