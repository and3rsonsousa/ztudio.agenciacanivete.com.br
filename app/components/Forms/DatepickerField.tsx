import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import * as Popover from "@radix-ui/react-popover";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/esm/locale";
import { useState } from "react";
import InputField from "./InputField";

export default function DatepickerField({
  title,
  name,
  date,
  pattern,
  full,
}: {
  title: string;
  name: string;
  date?: Date;
  pattern?: string;
  full?: boolean;
}) {
  let today = startOfToday();
  const _date = date ?? new Date();

  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyy"));
  let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let [selectedDay, setSelectedDay] = useState(new Date(_date));

  let newDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayOfCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  const formatValue = (date: Date) =>
    format(
      date,
      pattern ?? full
        ? "iiii, d 'de' MMMM 'de' y 'às' H'h'".concat(
            format(date, "mm") === "00" ? "" : "mm"
          )
        : "EEEEEE, d/M/yy 'às' H'h'".concat(
            format(date, "mm") === "00" ? "" : "mm"
          ),
      {
        locale: ptBR,
      }
    );
  let [Value, setValue] = useState(formatValue(selectedDay));

  return (
    <label className="field ">
      <div className="field-label">{title}</div>
      <input
        type="hidden"
        name={name}
        value={format(selectedDay, "y-MM-dd'T'HH:mm:ss")}
      />
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="field-input overflow-hidden text-ellipsis whitespace-nowrap first-letter:capitalize">
            {Value}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="dropdown-content text-xx p-4 text-center font-light antialiased outline-none dark:text-gray-200">
            <div className="flex justify-between ">
              <button
                onClick={() =>
                  setCurrentMonth(
                    format(
                      add(firstDayOfCurrentMonth, { months: -1 }),
                      "MMM-yyyy"
                    )
                  )
                }
              >
                <ChevronLeftIcon className="w-4" />
              </button>
              <div className="uppercase tracking-wide">
                {format(firstDayOfCurrentMonth, "MMMM")}
              </div>
              <button
                onClick={() =>
                  setCurrentMonth(
                    format(
                      add(firstDayOfCurrentMonth, { months: 1 }),
                      "MMM-yyyy"
                    )
                  )
                }
              >
                <ChevronRightIcon className="w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                <div
                  key={index}
                  className="p-1 font-semibold text-gray-700 antialiased "
                >
                  {day}
                </div>
              ))}
              {newDays.map((day, i) => (
                <div
                  role="button"
                  className={`p-1  ${
                    format(day, "dd/MM/y") === format(selectedDay, "dd/MM/y")
                      ? " rounded-full bg-brand font-semibold text-white "
                      : isToday(day)
                      ? "font-semibold text-brand"
                      : ""
                  }${
                    !isSameMonth(day, firstDayOfCurrentMonth)
                      ? " text-gray-400 dark:text-gray-500"
                      : ""
                  }`}
                  key={i}
                  onClick={(event) => {
                    setValue(formatValue(day));
                    setSelectedDay(day);
                  }}
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
            {/* <div>
              <input
                type="text"
                className="appearance-none bg-transparent text-center  text-sm focus:outline-none"
                pattern="[0-2][0-9]:[0-5][0-9]:[0-5][0-9]"
                required
                value={format(selectedDay, "HH:mm:ss")}
                
              />
            </div> */}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </label>
  );
}
