import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { Form, useOutletContext } from "@remix-run/react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  setDefaultOptions,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { ActionModel, DayModel } from "~/lib/models";
import { Action, ActionMedium } from "./Actions";
import Button from "./Forms/Button";
import Checkbox from "./Forms/Checkbox";
import Field from "./Forms/Field";

export default function Calendar({ actions }: { actions: ActionModel[] }) {
  setDefaultOptions({ locale: ptBR });
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
    _day.celebrations = [];
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
    // changeMonth(getMonth(day) - getMonth(firstDayOfCurrentMonth));
  }

  return (
    <div className="calendar lg:flex lg:h-screen lg:flex-col">
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

      <div className="flex-auto overflow-hidden lg:flex">
        {/* Calendar  */}
        <div className="no-scrollbars flex w-full flex-col overflow-auto dark:border-gray-800 lg:border-r">
          <div className="grid grid-cols-7">
            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
              (day, index) => (
                <div key={index} className="calendar-weekday">
                  {day}
                </div>
              )
            )}
          </div>
          <div className="grid flex-auto grid-cols-7">
            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day${
                  isToday(day.date) ? " is-today" : ""
                }${
                  isSameMonth(day.date, firstDayOfCurrentMonth)
                    ? ""
                    : " not-this-month"
                }${isEqual(selectedDay, day.date) ? " is-selected" : ""}`}
              >
                <div className="px-2 lg:px-1">
                  <button
                    className="appearance-none"
                    onClick={() => setSelectedDayAndCurrentMonth(day.date)}
                  >
                    {format(day.date, "d")}
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
                  {day.actions.map((action, index) => (
                    <Action key={index} action={action} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Info */}
        <CalendarInfo
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

const CalendarInfo = ({ day }: { day: DayModel }) => {
  const context: {
    celebrations: {
      openDialogCelebration: boolean;
      setOpenDialogCelebration: () => void;
    };
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: () => void;
    };
  } = useOutletContext();

  return (
    <div className="mt-16 flex flex-col overflow-hidden border-t pt-16 lg:mt-0 lg:w-96 lg:border-0 lg:pt-0">
      {day !== undefined ? (
        <>
          <div className="border-b p-4 dark:border-gray-800">
            {/* Header */}

            <h5>{format(day.date, "d 'de' MMMM 'de' y")}</h5>

            {/* Celebrations */}

            {day.celebrations.length > 0 ? (
              <div className="mt-4 flex flex-col">
                {day.celebrations.map((celebration, index) => (
                  <div key={index} className="my-1 w-full text-xs font-normal">
                    {celebration.name}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="no-scrollbars flex h-full  flex-col overflow-auto p-4">
            {day.actions.length > 0 ? (
              day.actions.map((action, i) => (
                <ActionMedium action={action} key={i} />
              ))
            ) : (
              <Exclamation>Nenhuma ação para esse dia</Exclamation>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-auto p-8">
          <Exclamation icon>Escolha um dia no calendário ao lado</Exclamation>
        </div>
      )}
      <div className="flex items-center justify-end border-t p-4 dark:border-gray-800">
        {/* Dialog for Celebrations */}
        <Dialog.Root
          open={context.celebrations.openDialogCelebration}
          onOpenChange={context.celebrations.setOpenDialogCelebration}
        >
          <Dialog.Trigger asChild>
            <Button link>
              <CalendarIcon />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <AnimatePresence>
              <>
                <Dialog.Overlay className="dialog-overlay" />

                <Dialog.Content className="dialog">
                  <motion.div
                    className="dialog-content p-4 font-light  antialiased lg:p-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { ease: "circOut", duration: 0.6 },
                    }}
                  >
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
                  </motion.div>
                </Dialog.Content>
              </>
            </AnimatePresence>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Dialog for Actions */}
        <Dialog.Root
          open={context.actions.openDialogAction}
          onOpenChange={context.actions.setOpenDialogAction}
        >
          <Dialog.Trigger asChild>
            <Button primary>
              Nova Ação <PlusIcon />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content asChild>
              <motion.div className="dialog-content p-4 font-light text-gray-700 antialiased">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
                totam nostrum, unde assumenda consequatur labore ex eos fugiat
                aliquid inventore eius explicabo officia cumque ducimus
                dignissimos et facere iusto. Deserunt.
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

const Exclamation = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: boolean;
}) => (
  <div>
    <div className="mx-auto flex items-center gap-4 rounded-xl bg-gray-100 p-4 text-xs dark:bg-gray-800">
      {icon ? <ExclamationTriangleIcon className="w-8 text-gray-400" /> : null}
      <div>{children}</div>
    </div>
  </div>
);
