import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useOutletContext } from "@remix-run/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { fade, scaleUp } from "~/lib/animations";
import type { DayModel } from "~/lib/models";
import { ActionMedium } from "./Actions";
import AddActionDialog from "./AddActionDialog";
import AddCelebrationDialog from "./AddCelebrationDialog";
import Celebration from "./Celebrations";
import Exclamation from "./Exclamation";
import Button from "./Forms/Button";

const DayInfo = ({ day }: { day: DayModel }) => {
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
            <div className="flex items-center justify-between">
              <h5>{format(day.date, "d 'de' MMMM 'de' y")}</h5>
              <Button link>
                <ChevronRightIcon />
              </Button>
            </div>

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
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>
                <Dialog.Content className="dialog" forceMount>
                  <motion.div
                    className="dialog-content w-96 max-w-lg p-4 font-light  antialiased lg:p-8"
                    {...scaleUp()}
                  >
                    <AddActionDialog date={day.date} />
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

export default DayInfo;
