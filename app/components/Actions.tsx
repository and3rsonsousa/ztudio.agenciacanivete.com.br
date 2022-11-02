import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useMatches } from "@remix-run/react";
import type { ActionModel, ItemModel } from "~/lib/models";

export const Action = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  const tags: ItemModel[] = matches[1].data.tags;
  const status: ItemModel[] = matches[1].data.status;

  return (
    <div
      className={`bg- mx-1 mt-1 overflow-hidden text-ellipsis whitespace-nowrap  rounded py-1 px-2 text-xs font-medium bg-${
        status.filter((stat) => stat.id === action.status)[0].slug
      }`}
    >
      {action.name}
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
      className={`group mb-2 flex flex-nowrap justify-between gap-4 rounded border-l-4 bg-gray-50 py-2 px-4 transition duration-500  hover:bg-gray-100 dark:bg-gray-800 border-${stat.slug}`}
    >
      <div>
        <div className="text-sm font-normal">{action.name}</div>
        <div className="text-xx flex gap-4 text-gray-500">
          <div>12h13</div>
          <div>Clínica Univet</div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-post-500"></div>
            <div>{tag.name}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 py-2 text-gray-300 opacity-0 transition group-hover:opacity-100">
        <button>
          <PencilIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
        </button>
        <button>
          <DocumentDuplicateIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
        </button>
        <button>
          <TrashIcon className="w-3 transition hover:scale-125 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};
