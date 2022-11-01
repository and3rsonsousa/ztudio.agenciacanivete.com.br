import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { Form } from "@remix-run/react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  setDefaultOptions,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import Button from "./Forms/Button";
import Checkbox from "./Forms/Checkbox";
import Field from "./Forms/Field";

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
    <div className="calendar lg:flex lg:h-screen lg:flex-col">
      <div className="flex items-center justify-between border-b">
        <h2 className="mb-0 p-4 text-2xl first-letter:capitalize lg:text-3xl">
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
      <div className="flex-auto gap-4 overflow-hidden lg:flex">
        <div className="no-scrollbars w-full overflow-auto lg:border-r">
          <div className="grid grid-cols-7">
            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
              (day, index) => (
                <div key={index} className="calendar-weekday">
                  {day}
                </div>
              )
            )}
          </div>
          <div className="grid grid-cols-7">
            {newDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day${isToday(day) ? " is-today" : ""}${
                  isSameMonth(day, firstDayOfCurrentMonth)
                    ? ""
                    : " not-this-month"
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
        </div>

        <CalendarInfo day={selectedDay} />
      </div>
    </div>
  );
}

const CalendarInfo = ({ day }: { day: Date }) => (
  <div className="no-scrollbars h-full flex-auto overflow-auto p-4 lg:w-96 lg:p-4">
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-4">
          <h5>{format(day, "d 'de' MMMM 'de' y")}</h5>
        </div>
        {/* Celebrations */}
        <div className="flex flex-col">
          {[1, 2, 3].map((celebration) => (
            <div key={celebration} className="my-1 w-full text-xs font-normal">
              Dia de todos os santos
            </div>
          ))}
        </div>
        <hr className="my-4 dark:border-gray-800" />

        {[
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
          " nisi corrupti a.",
          "enim repellendus quas facilis veritatis",
          "id consequatur sed dolorem qui pariatur veniam doloribus!",
          "Ipsa quidem cumque placeat minima asperiores.",
          "Lorem, ipsum dolor sit",
        ].map((action, i) => (
          <div
            key={action}
            className={`mb-4 rounded  border-l-4 bg-gray-50 py-2 px-4 ${
              i % 2 === 0 ? "border-l-do-500" : "border-l-accomplished-500"
            }`}
          >
            <div className="text-sm font-normal">{action}</div>
            <div className="text-xx flex gap-4 text-gray-500">
              <div>12h13</div>
              <div>Clínica Univet</div>
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-post-500"></div>
                <div>POST</div>
              </div>
              <div></div>
            </div>
          </div>
        ))}

        {/* <div className="mx-auto flex items-center gap-2 rounded-lg bg-gray-100 p-4 text-center text-xs text-gray-400">
        <div>
          <ExclamationCircleIcon className="w-5" />
        </div>

        <div>Nenhuma ação para esse dia</div>
      </div> */}
      </div>
      <div className="flex items-center justify-end">
        <div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button link>
                <CalendarIcon />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content p-4 font-light text-gray-700 antialiased lg:p-8">
                <Dialog.Title>
                  <h3>Nova Data Comemorativa</h3>
                </Dialog.Title>
                <Form method="post">
                  <Field name="name" title="Nome" />
                  <Field
                    name="date"
                    title="Data"
                    pattern="[0-9]{1,2}/[0-9]{1,2}"
                  />
                  <Checkbox title="Feriado" name="is_holiday" />
                  <div className="text-right">
                    <Button primary>Adicionar</Button>
                  </div>
                </Form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button primary>
                Nova Ação <PlusIcon />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content p-4 font-light text-gray-700 antialiased">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
                totam nostrum, unde assumenda consequatur labore ex eos fugiat
                aliquid inventore eius explicabo officia cumque ducimus
                dignissimos et facere iusto. Deserunt.
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  </div>
);
