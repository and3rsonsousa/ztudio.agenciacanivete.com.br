import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { ActionMedium } from "./Actions";
import AddCelebrationDialog from "./AddCelebrationDialog";
import Celebration from "./Celebrations";
import Day from "./Day";
import Exclamation from "./Exclamation";
import Button from "./Forms/Button";

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
              <div className=" mt-4 flex flex-col">
                {day.celebrations.map((celebration, index) => (
                  <Celebration celebration={celebration} key={index} />
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
              <Exclamation icon>Nenhuma ação para esse dia</Exclamation>
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
