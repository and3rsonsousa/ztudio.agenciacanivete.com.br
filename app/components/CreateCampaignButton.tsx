import { CalendarIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { fade, scaleUp } from "~/lib/animations";
import CampaignDialog from "./Dialogs/CampaignDialog";
import Button from "./Forms/Button";

export default function CreateCelebrationButton({ date }: { date: Dayjs }) {
  const context: {
    campaigns: {
      openDialogCampaign: boolean;
      setOpenDialogCampaign: (b?: boolean) => void;
    };
  } = useOutletContext();

  return (
    <Dialog.Root onOpenChange={context.campaigns.setOpenDialogCampaign}>
      <Dialog.Trigger asChild>
        <Button link small>
          <CalendarIcon />
        </Button>
      </Dialog.Trigger>
      <AnimatePresence>
        {context.campaigns.openDialogCampaign ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="dialog-overlay" {...fade()}></motion.div>
            </Dialog.Overlay>

            <Dialog.Content forceMount className="dialog">
              <motion.div
                className="dialog-content w-[36rem] max-w-lg p-4 font-light  antialiased lg:p-8 lg:pb-4"
                {...scaleUp()}
              >
                <CampaignDialog date={date} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
