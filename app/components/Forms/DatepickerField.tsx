import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

import { useState } from "react";
import { getPeriod } from "~/lib/functions";

dayjs.locale("pt-br");

export default function DatepickerField({
  title,
  name,
  date,
  pattern,
  full,
}: {
  title: string;
  name: string;
  date?: Dayjs;
  pattern?: string;
  full?: boolean;
}) {
  const _date = date ?? dayjs();

  let [selectedDay, setSelectedDay] = useState(_date);
  let [currentMonth, setCurrentMonth] = useState(_date.format("YYYY-MM"));
  const { firstDayOfCurrentMonth, days } = getPeriod({ period: currentMonth });

  const formatValue = (date: Dayjs) =>
    date.format(
      pattern ?? full
        ? "dddd, D [de] MMMM [de] YYYY [às] H[h]".concat(
            date.format("mm") === "00" ? "" : "mm"
          )
        : "ddd, D/M/YY [às] H[h]".concat(date.format("mm") === "00" ? "" : "mm")
    );
  let [Value, setValue] = useState(formatValue(selectedDay));

  return (
    <label className="field ">
      <div className="field-label">{title}</div>
      <input
        type="hidden"
        name={name}
        value={selectedDay.format("YYYY-MM-DD[T]HH:mm:ss")}
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
                    firstDayOfCurrentMonth
                      .subtract(1, "month")
                      .format("YYYY-MM")
                  )
                }
              >
                <ChevronLeftIcon className="w-4" />
              </button>
              <div className="uppercase tracking-wide">
                {firstDayOfCurrentMonth.format("MMMM")}
              </div>
              <button
                onClick={() =>
                  setCurrentMonth(
                    firstDayOfCurrentMonth.add(1, "month").format("YYYY-MM")
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
                  className="p-1 font-semibold text-gray-700 antialiased dark:text-gray-200 "
                >
                  {day}
                </div>
              ))}
              {days.map((day, i) => (
                <div
                  role="button"
                  className={`p-1  ${
                    day.format("YYYY-MM-DD") ===
                    selectedDay.format("YYYY-MM-DD")
                      ? " rounded bg-brand font-semibold text-white "
                      : day.format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD")
                      ? "font-semibold text-brand"
                      : ""
                  }${
                    day.format("YYYY-MM") !==
                    firstDayOfCurrentMonth.format("YYYY-MM")
                      ? " text-gray-500 "
                      : ""
                  }`}
                  key={i}
                  onClick={(event) => {
                    setValue(formatValue(day));
                    setSelectedDay(day);
                  }}
                >
                  {day.format("D")}
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
