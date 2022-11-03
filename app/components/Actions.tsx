import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useMatches } from "@remix-run/react";
import { format } from "date-fns";
import { parseISO } from "date-fns/esm";
import type { ActionModel, ItemModel } from "~/lib/models";

export const Action = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  // const tags: ItemModel[] = matches[1].data.tags;
  const status: ItemModel[] = matches[1].data.status;

  return (
    <div
      className={`mx-1 mt-1 rounded py-1 px-2 bg-${
        status.filter((stat) => stat.id === action.status)[0].slug
      } bg-${
        status.filter((stat) => stat.id === action.status)[0].slug
      }-hover flex cursor-pointer items-center justify-between transition`}
    >
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
        {action.name}
      </div>
      <div className="text-xx hidden font-medium opacity-75 2xl:block">
        {format(parseISO(action.date), "h'h'")}
        {format(parseISO(action.date), "mm") !== "00"
          ? format(parseISO(action.date), "mm")
          : ""}
      </div>
    </div>
  );
};

export const ActionMedium = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  const tags: ItemModel[] = matches[1].data.tags;
  const status: ItemModel[] = matches[1].data.status;
  const tag = tags.filter((tag) => tag.id === action.tag)[0];
  const stat = status.filter((stat) => stat.id === action.status)[0];

  return (
    <div
      className={`group relative mb-2 flex flex-nowrap justify-between gap-4 rounded border-l-4 bg-gray-50 p-4 transition duration-500  hover:bg-gray-100 dark:bg-gray-800 border-${stat.slug}`}
    >
      <div>
        <div className="text-sm font-normal">{action.name}</div>
        {action.description ? (
          <div className="text-xx mb-2">{action.description}</div>
        ) : null}
        <div className="text-xx flex gap-4 text-gray-500">
          <div>12h13</div>
          <div>Clínica Univet</div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-post-500"></div>
            <div>{tag.name}</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 flex translate-y-4  justify-between gap-2 rounded bg-gray-800 p-2 text-gray-400 opacity-0 transition group-hover:translate-y-0  group-hover:opacity-100">
        <button>
          <PencilIcon className="w-3 transition hover:text-gray-300" />
        </button>
        <button>
          <DocumentDuplicateIcon className="w-3 transition hover:text-gray-300" />
        </button>
        <button>
          <TrashIcon className="w-3 transition hover:text-gray-300" />
        </button>
      </div>
    </div>
  );
};
