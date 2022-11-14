import { PlusIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useOutletContext } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { fade, scaleUp } from "~/lib/animations";
import type { DayModel } from "~/lib/models";
import ActionDialog from "./Dialogs/ActionDialog";
import Button from "./Forms/Button";

export default function CreateCelebrationButton({ day }: { day: DayModel }) {
  const context: {
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: (b?: boolean) => void;
    };
  } = useOutletContext();

  return (
    <Dialog.Root
      open={context.actions.openDialogAction}
      onOpenChange={context.actions.setOpenDialogAction}
    >
      <Dialog.Trigger asChild>
        <div className="ml-4">
          <Button primary>
            Nova Ação <PlusIcon />
          </Button>
        </div>
      </Dialog.Trigger>
      <AnimatePresence>
        {context.actions.openDialogAction ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="dialog-overlay" {...fade()}></motion.div>
            </Dialog.Overlay>
            <Dialog.Content className="dialog" forceMount>
              <motion.div
                className="dialog-content w-[36rem] max-w-lg p-4 font-light  antialiased lg:p-8 lg:pb-4"
                {...scaleUp()}
              >
                <ActionDialog date={day.date} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
