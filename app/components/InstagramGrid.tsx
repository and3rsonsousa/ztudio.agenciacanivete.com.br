import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { useMatches, useOutletContext } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";
import type { ActionModel, ContextType, ItemModel } from "~/lib/models";
import { ActionGrid } from "./Actions";
import Button from "./Button";
import CreateButtons from "./CreateButtons";
import Exclamation from "./Exclamation";

export type SupportType = { id: string; date: string; name: string };
export type FilterType = SupportType[];

export default function InstagramGrid({ actions }: { actions: ActionModel[] }) {
  const context: ContextType = useOutletContext();
  const [fill, setFill] = useState(true);
  const matches = useMatches();
  const { tags } = matches[1].data;

  const gridTags = tags.filter(
    (tag: ItemModel) => tag.slug === "feed" || tag.slug === "reels"
  );

  let filtered: FilterType = actions.filter(
    (action: ActionModel) =>
      gridTags.filter((tag: ItemModel) => tag.id === action.tag.id).length > 0
  );

  if (fill && filtered.length > 3 && filtered.length % 3 !== 0) {
    const support = Array(3 - (filtered.length % 3)).fill("support");

    support.forEach((_, index) => {
      filtered.push({
        id: index.toString(),
        date: dayjs(filtered[filtered.length - 1].date)
          .add(1, "day")
          .format("YYYY-MM-DD[T]HH:mm:ss"),
        name: "support",
      });
    });
  }

  filtered = filtered.reverse();

  return (
    <div
      className={`mt-16 flex flex-shrink-0 flex-col overflow-hidden  pt-16 lg:mt-0 ${
        context.sidebar.open ? "lg:w-80" : "lg:w-12"
      }  lg:pt-0`}
    >
      <div className="px-4 py-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          {context.sidebar.open && <h5 className="text-xs">Instagram Grid</h5>}
          <div className={!context.sidebar.open ? "-ml-2" : " space-x-1"}>
            {context.sidebar.open && (
              <Button
                title="Preencher as lacunas"
                link={!fill}
                small
                icon
                squared
                primary={fill}
                onClick={() => setFill(!fill)}
              >
                <SquaresPlusIcon />
              </Button>
            )}
            <Button
              title={context.sidebar.open ? "Mostrar" : "Ocultar"}
              link
              small
              squared
              icon
              onClick={() => context.sidebar.setOpen(!context.sidebar.open)}
            >
              {context.sidebar.open ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </Button>
          </div>
        </div>
      </div>
      {context.sidebar.open &&
        (filtered.length ? (
          <div className="no-scrollbars grid h-full grid-cols-3 flex-col content-start overflow-auto px-4">
            {filtered.map((action, i) => (
              <ActionGrid
                action={action}
                key={i}
                index={i}
                total={filtered.length}
              />
            ))}
          </div>
        ) : (
          <div className=" flex-auto p-8">
            <Exclamation icon>
              Nenhuma ação para o Feed do Instagram no mês selecionado.
            </Exclamation>
          </div>
        ))}
      {context.sidebar.open && <CreateButtons action campaign celebration />}
    </div>
  );
}
