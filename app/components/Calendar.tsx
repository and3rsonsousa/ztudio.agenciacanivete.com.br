import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isEqual,
  isSameMonth,
  isToday,
  setDefaultOptions,
  startOfMonth,
  startOfToday,
  startOfWeek,
  endOfWeek,
  parse,
  getMonth,
} from "date-fns";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import Button from "./Forms/Button";

export default function Calendar() {
  setDefaultOptions({ locale: ptBR });
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyy"));
  let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let newDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayOfCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  function changeMonth(value: number) {
    if (value !== 0) {
      let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: value });
      setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    }
  }

  function setSelectedDayAndCurrentMonth(day: Date) {
    setSelectedDay(day);
    changeMonth(getMonth(day) - getMonth(firstDayOfCurrentMonth));
  }

  return (
    <div className="calendar">
      <div className="flex items-center justify-between">
        <h2 className="mb-0 px-2 py-4 text-2xl first-letter:capitalize lg:text-3xl">
          {format(firstDayOfCurrentMonth, `MMMM 'de' Y`)}
        </h2>
        <div>
          <Button link onClick={() => changeMonth(-1)}>
            <ChevronLeftIcon />
          </Button>
          <Button link onClick={() => changeMonth(1)}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day, index) => (
          <div key={index} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {newDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day${isToday(day) ? " is-today" : ""}${
              isSameMonth(day, firstDayOfCurrentMonth) ? "" : " not-this-month"
            }${isEqual(selectedDay, day) ? " is-selected" : ""}`}
          >
            <button
              className="appearance-none"
              onClick={() => setSelectedDayAndCurrentMonth(day)}
            >
              {format(day, "d")}
            </button>
          </div>
        ))}
      </div>

      <div className="px-2 py-4">
        <h5>{format(selectedDay, "d 'de' MMMM 'de' y")}</h5>
      </div>
    </div>
  );
}
