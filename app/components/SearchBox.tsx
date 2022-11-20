import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useOutletContext } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fade, scaleUp } from "~/lib/animations";

export default function SearchBox() {
  const context: {
    search: {
      openDialogSearch: boolean;
      setOpenDialogSearch: (b?: boolean) => void;
    };
  } = useOutletContext();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(window.navigator.userAgent.search("Mac") !== -1);

    function keyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        context.search.setOpenDialogSearch(!context.search.openDialogSearch);
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [isMac, context]);

  return (
    <Dialog.Root
      open={context.search.openDialogSearch}
      onOpenChange={context.search.setOpenDialogSearch}
    >
      <Dialog.Trigger asChild>
        <button
          onClick={() => {}}
          className="header-menu-link flex w-full cursor-text items-center justify-between gap-2 rounded lg:bg-gray-100 lg:dark:bg-gray-800"
        >
          <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 lg:flex">
            <div>Pesquisar</div>

            <div className="font-semibold ">
              {isMac ? <span></span> : <span>Ctrl</span>} + K
            </div>
          </div>
          <div>
            <MagnifyingGlassIcon />
          </div>
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {context.search.openDialogSearch && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="dialog-overlay" {...fade()}></motion.div>
            </Dialog.Overlay>

            <Dialog.Content forceMount className="dialog dialog-search">
              <motion.div
                className="dialog-content top-1/3 w-[36rem] max-w-lg font-light antialiased "
                {...scaleUp()}
              >
                <input type="text" className="field-input" />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
