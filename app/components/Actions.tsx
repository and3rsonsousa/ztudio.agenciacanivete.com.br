import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useFetcher, useMatches, useNavigate } from "@remix-run/react";
import { format } from "date-fns";

import type { AccountModel, ActionModel, ItemModel } from "~/lib/models";

export const Action = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  const accounts: AccountModel[] = matches[1].data.accounts;
  const tags: ItemModel[] = matches[1].data.tags;
  const account = accounts.filter(
    (account) => account.id === action.account
  )[0];
  const tag = tags.filter((tag) => tag.id === action.tag)[0];

  const status: ItemModel[] = matches[1].data.status;
  const navigate = useNavigate();

  return (
    <div
      data-date={action.date}
      data-id={action.id}
      draggable
      onDragStart={(e) => {
        const ele = e.target as HTMLElement;
        const ghost = ele.cloneNode(true) as HTMLElement;

        ghost.style.width = `${ele.offsetWidth}px`;
        ghost.style.height = `${ele.offsetHeight}px`;
        ghost.style.position = "absolute";
        ghost.style.top = "0";
        ghost.style.left = "0";
        ghost.style.offset = ".2";
        ghost.style.zIndex = "-1";
        ghost.classList.add("dragging");

        document.querySelector(".app")?.appendChild(ghost);
        e.dataTransfer?.setDragImage(
          ghost,
          ele.offsetWidth / 2,
          ele.offsetHeight / 2
        );

        setTimeout(() => {
          ghost.parentNode?.removeChild(ghost);
        }, 1000);
      }}
      className={`action-line duration-500 bg-${
        status.filter((stat) => stat.id === action.status)[0].slug
      } bg-${
        status.filter((stat) => stat.id === action.status)[0].slug
      }-hover flex cursor-pointer items-center justify-between gap-2`}
      title={action.name}
      onClick={() => {
        navigate(`/dashboard/${account.slug}/action/${action.id}`);
      }}
    >
      <div className="flex items-center gap-1 overflow-hidden">
        <div className="text-xx hidden font-semibold uppercase opacity-50 2xl:block">
          {tag.name.slice(0, 3)}
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
          {action.name}
        </div>
      </div>
      <div className="text-xx hidden font-medium opacity-75 2xl:block">
        {format(new Date(action.date), "H'h'")}
        {format(new Date(action.date), "mm") !== "00"
          ? format(new Date(action.date), "mm")
          : ""}
      </div>
    </div>
  );
};

export const ActionMedium = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  const fetcher = useFetcher();
  const tags: ItemModel[] = matches[1].data.tags;
  const acccounts: AccountModel[] = matches[1].data.accounts;
  const account = acccounts.filter(
    (account) => account.id === action.account
  )[0];
  const status: ItemModel[] = matches[1].data.status;
  const tag = tags.filter((tag) => tag.id === action.tag)[0];
  const stat = status.filter((stat) => stat.id === action.status)[0];
  const navigate = useNavigate();
  const date = new Date(action.date);

  return (
    <div
      className={`action-medium group relative mb-2 flex flex-nowrap justify-between gap-4 rounded border-l-4 bg-gray-50 p-4 transition duration-500  hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-${stat.slug}`}
    >
      <div>
        <div className="text-sm font-normal">{action.name}</div>
        {action.description ? (
          <div className="text-xx mb-2">{action.description}</div>
        ) : null}
        <div className="text-xx flex gap-4 text-gray-500">
          <div>
            {format(date, "H'h'")}
            {format(date, "mm") !== "00" ? format(date, "mm") : ""}
          </div>
          <div>{account.name}</div>
          <div className="flex items-center gap-1">
            <div className={`h-1 w-1 rounded-full bg-${tag.slug}`}></div>
            <div>{tag.name}</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 flex translate-y-4  justify-between gap-2 rounded bg-gray-800 p-2 text-gray-400 opacity-0 transition group-hover:translate-y-0  group-hover:opacity-100">
        <button
          onClick={() => {
            navigate(`/dashboard/${account.slug}/action/${action.id}`);
          }}
        >
          <PencilIcon className="w-3 transition hover:text-gray-300" />
        </button>
        <button
          onClick={() => {
            alert("Não implementado");
          }}
        >
          <DocumentDuplicateIcon className="w-3 transition hover:text-gray-300" />
        </button>
        <button
          onClick={() => {
            fetcher.submit(
              {
                action: "delete-action",
                id: action.id,
              },
              {
                method: "post",
              }
            );
          }}
        >
          <TrashIcon className="w-3 transition hover:text-gray-300" />
        </button>
      </div>
    </div>
  );
};
