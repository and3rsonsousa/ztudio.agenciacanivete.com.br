import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(window.navigator.userAgent.search("Mac") !== -1);

    function keyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        setDialogOpen(!dialogOpen);
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [isMac, dialogOpen]);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
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
      <Dialog.Overlay className="dialog-overlay">
        <Dialog.Content className="dialog-content w-72 overflow-hidden border border-black/5 sm:w-96 lg:w-[36rem]">
          ok
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}
