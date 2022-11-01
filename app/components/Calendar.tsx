import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
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

const phrases = [
  "This is the last random sentence I will be writing and I am going to stop mid-sent",
  "The old apple revels in its authority.",
  "She finally understood that grief was her love with no place for it to go.",
  "The irony of the situation wasn't lost on anyone in the room.",
  "Their argument could be heard across the parking lot.",
  "So long and thanks for the fish.",
  "His mind was blown that there was nothing in space except space itself.",
  "I love eating toasted cheese and tuna sandwiches.",
  "I've always wanted to go to Tajikistan, but my cat would miss me.",
  "She was the type of girl that always burnt sugar to show she cared.",
];

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
      <div className="flex-auto  overflow-hidden lg:flex">
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
                <div className="px-2 lg:px-1">
                  <button
                    className="appearance-none"
                    onClick={() => setSelectedDayAndCurrentMonth(day)}
                  >
                    {format(day, "d")}
                  </button>
                </div>
                {/* Ações Contínuas */}
                {index >= 10 && index <= 18 ? (
                  <div className={`relative mt-2 -mb-1 h-6 `}>
                    {index === 10 || index % 7 === 0 ? (
                      <div
                        className={`absolute z-10 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap bg-idea-500 py-1 px-2 text-xs font-medium text-white transition hover:bg-idea-600 ${
                          index === 10 ? " ml-1 rounded-l " : " rounded-r"
                        }`}
                        style={
                          index === 10
                            ? {
                                width:
                                  " calc(" +
                                  (7 - (index % 7)) * 100 +
                                  "% - 4px)",
                              }
                            : {
                                width:
                                  " calc(" +
                                  100 * (18 - index > 7 ? 7 : 18 - index + 1) +
                                  "% - 4px)",
                              }
                        }
                      >
                        {index === 10 || index % 7 === 0
                          ? "Nome da Ação nessa linha que vai ser bem grande para ver como fica aqui que não é tão largo, né?"
                          : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {index >= 16 && index <= 19 ? (
                  <div
                    className={`relative mt-2 -mb-1`}
                    style={{ height: 24 + "px" }}
                  >
                    {index === 16 || index % 7 === 0 ? (
                      <div
                        className={`absolute z-10 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap bg-doing-500 py-1 px-2 text-xs font-medium text-white  transition hover:bg-doing-600 ${
                          index === 16
                            ? Math.ceil(19 / 7) * 7 > 19
                              ? " ml-1 rounded "
                              : " ml-1 rounded-l "
                            : " rounded-r"
                        }`}
                        style={{
                          width:
                            " calc(" +
                            100 * (18 - index > 7 ? 7 : 19 - index + 1) +
                            "% - " +
                            (Math.ceil(19 / 7) * 7 > 19 ? 8 : 4) +
                            "px)",
                        }}
                      >
                        {index === 16 || index % 7 === 0
                          ? "Black Friday - Newbyte"
                          : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-2">
                  {Array(Math.ceil(Math.random() * 4))
                    .fill(0)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="text-xx mx-1 mt-1 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-do-500 py-1 px-2 font-medium text-white"
                      >
                        {phrases[Math.floor(Math.random() * 10)]}
                      </div>
                    ))}
                </div>
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
  <div className="mt-16 flex h-full flex-auto  flex-col justify-between border-t pt-16 lg:mt-0 lg:w-96 lg:border-0 lg:pt-0">
    <div className="border-b p-4 pb-2">
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
    </div>

    <div className="no-scrollbars overflow-auto p-4">
      {[
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
        " nisi corrupti a.",
        "enim repellendus quas facilis veritatis",
        "id consequatur sed dolorem qui pariatur veniam doloribus!",
        "Ipsa quidem cumque placeat minima asperiores.",
        "enim repellendus quas facilis veritatis",
        "id consequatur sed dolorem qui pariatur veniam doloribus!",
        "Ipsa quidem cumque placeat minima asperiores.",
        "Lorem, ipsum dolor sit",
      ].map((action, i) => (
        <div
          key={action}
          className={`group mb-2 flex flex-nowrap justify-between gap-4 rounded border-l-4 bg-gray-50 py-2 px-4 transition duration-500  hover:bg-gray-100 ${
            i % 2 === 0 ? "border-l-do-500" : "border-l-accomplished-500"
          }`}
        >
          <div>
            <div className="text-sm font-normal">{action}</div>
            <div className="text-xx flex gap-4 text-gray-500">
              <div>12h13</div>
              <div>Clínica Univet</div>
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-post-500"></div>
                <div>POST</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2 py-2 text-gray-300 opacity-0 transition group-hover:opacity-100">
            <button>
              <PencilIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
            </button>
            <button>
              <DocumentDuplicateIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
            </button>
            <button>
              <TrashIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-end border-t p-4">
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
);
