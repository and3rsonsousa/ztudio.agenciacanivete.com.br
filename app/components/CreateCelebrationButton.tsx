import { StarIcon } from "@heroicons/react/20/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { fade, scaleUp } from "~/lib/animations";
import CelebrationDialog from "./Dialogs/CelebrationDialog";
import Button from "./Forms/Button";

export default function CreateCelebrationButton({ date }: { date: Dayjs }) {
  const context: {
    celebrations: {
      openDialogCelebration: boolean;
      setOpenDialogCelebration: (b?: boolean) => void;
    };
  } = useOutletContext();

  return (
    <Dialog.Root onOpenChange={context.celebrations.setOpenDialogCelebration}>
      <Dialog.Trigger asChild>
        <Button link small>
          <StarIcon />
        </Button>
      </Dialog.Trigger>
      <AnimatePresence>
        {context.celebrations.openDialogCelebration ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="dialog-overlay" {...fade()}></motion.div>
            </Dialog.Overlay>

            <Dialog.Content forceMount className="dialog">
              <motion.div
                className="dialog-content w-96 max-w-lg p-4 font-light  antialiased lg:p-8 lg:pb-4"
                {...scaleUp()}
              >
                <CelebrationDialog date={date} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
