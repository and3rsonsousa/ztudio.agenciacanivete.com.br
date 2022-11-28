import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";
import type { ActionModel, ItemModel } from "~/lib/models";
import { ActionGrid } from "./Actions";
import CreateButtons from "./CreateButtons";
import Exclamation from "./Exclamation";
import Button from "./Button";

export type SupportType = { id: string; date: string; name: string };
export type FilterType = SupportType[];

export default function InstagramGrid({ actions }: { actions: ActionModel[] }) {
  const [view, setView] = useState(true);
  const [fill, setFill] = useState(true);
  const matches = useMatches();
  const { tags } = matches[1].data;

  const gridTags = tags.filter(
    (tag: ItemModel) => tag.slug === "post" || tag.slug === "reels"
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
      className={`mt-16 flex flex-shrink-0 flex-col overflow-hidden border-t pt-16 lg:mt-0 ${
        view ? "lg:w-80" : "lg:w-12"
      } lg:border-0 lg:pt-0`}
    >
      <div className="border-b p-4 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between">
          {view && <h5 className="text-xs">Instagram Grid</h5>}
          <div className={!view ? "-ml-2" : " space-x-1"}>
            {view && (
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
              title={view ? "Mostrar" : "Ocultar"}
              link
              small
              squared
              icon
              onClick={() => setView(!view)}
            >
              {view ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </Button>
          </div>
        </div>
      </div>
      {view &&
        (actions ? (
          <div className="no-scrollbars grid h-full grid-cols-3 flex-col content-start overflow-auto">
            {filtered.map((action, i) => (
              <ActionGrid action={action} key={i} index={i} />
            ))}
          </div>
        ) : (
          <div className=" flex-auto p-8">
            <Exclamation icon>
              Escolha um dia no calendário ao lado.
            </Exclamation>
          </div>
        ))}
      {view && <CreateButtons action campaign celebration />}
    </div>
  );
}
