import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useMatches, useOutletContext } from "@remix-run/react";
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
import { AnimatePresence, motion } from "framer-motion";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { fade, scaleUp } from "~/lib/animations";
import type { ActionModel, CelebrationModel, DayModel } from "~/lib/models";
import { Action, ActionMedium } from "./Actions";
import AddCelebrationDialog from "./AddCelebrationDialog";
import Button from "./Forms/Button";
import { StarIcon } from "@heroicons/react/20/solid";

export default function Calendar({ actions }: { actions: ActionModel[] }) {
  setDefaultOptions({ locale: ptBR });
  const celebrations: CelebrationModel[] = useMatches()[1].data.celebrations;
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

                {/* {index >= 11 && index <= 21 ? (
                  <div
                    className={`relative mt-2 -mb-1`}
                    style={{ height: 24 + "px" }}
                  >
                    {index === 11 || index % 7 === 0 ? (
                      <div
                        className={`absolute z-10 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap bg-doing-500 py-1 px-2 text-xs font-medium text-white  transition hover:bg-doing-600 ${
                          index === 11
                            ? Math.ceil(21 / 7) * 7 > 21
                              ? " ml-1 rounded "
                              : " ml-1 rounded-l "
                            : " rounded-r"
                        }`}
                        style={{
                          width:
                            " calc(" +
                            100 * (18 - index > 7 ? 7 : 21 - index + 1) +
                            "% - " +
                            (Math.ceil(21 / 7) * 7 > 21 ? 8 : 4) +
                            "px)",
                        }}
                      >
                        {index === 11 || index % 7 === 0
                          ? "Black Friday - Newbyte"
                          : null}
                      </div>
                    ) : null}
                  </div>
                ) : null} */}

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
                {day.celebrations
                  .sort((a, b) => (a.is_holiday > b.is_holiday ? -1 : 1))
                  .map((celebration, index) => (
                    <div
                      key={index}
                      className="my-1 flex w-full gap-1 text-xs font-normal"
                    >
                      {celebration.is_holiday ? (
                        <StarIcon className="w-3 text-gray-400" />
                      ) : null}
                      <div>{celebration.name}</div>
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
          onOpenChange={context.celebrations.setOpenDialogCelebration}
        >
          <Dialog.Trigger asChild>
            <Button link>
              <CalendarIcon />
            </Button>
          </Dialog.Trigger>
          <AnimatePresence>
            {context.celebrations.openDialogCelebration ? (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content w-96 max-w-lg p-4 font-light  antialiased lg:p-8"
                    {...scaleUp()}
                  >
                    <AddCelebrationDialog date={new Date()} />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            ) : null}
          </AnimatePresence>
        </Dialog.Root>

        {/* Dialog for Actions */}
        <Dialog.Root onOpenChange={context.actions.setOpenDialogAction}>
          <Dialog.Trigger asChild>
            <Button primary>
              Nova Ação <PlusIcon />
            </Button>
          </Dialog.Trigger>
          <AnimatePresence>
            {context.actions.openDialogAction ? (
              <Dialog.Portal forceMount>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content asChild className="dialog">
                  <motion.div className="dialog-content p-4 font-light text-gray-700 antialiased">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Soluta totam nostrum, unde assumenda consequatur labore ex
                    eos fugiat aliquid inventore eius explicabo officia cumque
                    ducimus dignissimos et facere iusto. Deserunt.
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            ) : null}
          </AnimatePresence>
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
