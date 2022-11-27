import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export default function SearchBox() {
  const context: {
    search: {
      openDialogSearch: boolean;
      setOpenDialogSearch: (b?: boolean) => void;
    };
  } = useOutletContext();

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        context.search.setOpenDialogSearch(!context.search.openDialogSearch);
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [context]);

  return (
    <button
      onClick={() => {
        context.search.setOpenDialogSearch(true);
      }}
      className="flex w-full cursor-text items-center gap-2 rounded-lg px-3 py-2 outline-none lg:bg-gray-100 lg:dark:bg-gray-800"
    >
      <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 lg:flex">
        <div>Pesquisar</div>

        <div className="font-semibold"> + K</div>
      </div>
      <div className="ml-auto">
        <MagnifyingGlassIcon className="w-4" />
      </div>
    </button>
  );
}
