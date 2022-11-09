import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon as Duplicate,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

import { Link, useFetcher, useMatches, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import * as ContextMenu from "@radix-ui/react-context-menu";

import type { AccountModel, ActionModel, ItemModel } from "~/lib/models";
import {
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon as Trash,
} from "@heroicons/react/24/outline";

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

  const fetcher = useFetcher();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
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
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="dropdown-content w-36">
          <ContextMenu.Item asChild>
            <Link
              to={`/dashboard/${account.slug}/action/${action.id}`}
              className="dropdown-item item-small flex items-center gap-2"
            >
              <PencilSquareIcon className="w-4" /> <div>Editar</div>
            </Link>
          </ContextMenu.Item>

          <ContextMenu.Item
            onSelect={(event) => {
              fetcher.submit(
                {
                  action: "duplicate-action",
                  id: action.id,
                },
                {
                  method: "post",
                }
              );
            }}
            className="dropdown-item item-small flex items-center gap-2"
          >
            <DocumentDuplicateIcon className="w-4" /> <div>Duplicar</div>
          </ContextMenu.Item>
          <ContextMenu.Item
            onSelect={(event) => {
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
            className="dropdown-item item-small flex items-center gap-2"
          >
            <Trash className="w-4" /> <div>Excluir</div>
          </ContextMenu.Item>
          <hr className="dropdown-hr" />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
              <TagIcon className="w-4" />
              <div className="flex flex-auto justify-between gap-4">
                <div>Tags</div>

                <div className="">
                  <ChevronRightIcon className="w-4" />
                </div>
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="dropdown-content w-36">
                {tags.map((tag) => (
                  <ContextMenu.Item
                    key={tag.id}
                    onSelect={(event) => {
                      fetcher.submit(
                        {
                          action: "update-tag",
                          id: action.id,
                          tag: tag.id,
                        },
                        {
                          method: "post",
                        }
                      );
                    }}
                    className="dropdown-item item-small flex items-center gap-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full bg-${tag.slug}`}
                    ></div>
                    <div className="flex-shrink-0 flex-grow">{tag.name}</div>
                    {action.tag === tag.id && (
                      <CheckCircleIcon className="w-4" />
                    )}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
              <DocumentCheckIcon className="w-4" />
              <div className="flex flex-auto justify-between gap-4">
                <div>Status</div>

                <div className="">
                  <ChevronRightIcon className="w-4" />
                </div>
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="dropdown-content w-36">
                {status.map((stat) => (
                  <ContextMenu.Item
                    key={stat.id}
                    onSelect={(event) => {
                      fetcher.submit(
                        {
                          action: "update-status",
                          id: action.id,
                          status: stat.id,
                        },
                        {
                          method: "post",
                        }
                      );
                    }}
                    className="dropdown-item item-small flex items-center gap-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full bg-${stat.slug}`}
                    ></div>
                    <div className="flex-shrink-0 flex-grow">{stat.name}</div>
                    {action.status === stat.id && (
                      <CheckCircleIcon className="w-4" />
                    )}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
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
          title="Editar ação"
          onClick={() => {
            navigate(`/dashboard/${account.slug}/action/${action.id}`);
          }}
        >
          <PencilIcon className="w-3 transition hover:text-gray-300" />
        </button>
        <button
          title="Duplicar ação"
          onClick={() => {
            fetcher.submit(
              {
                action: "duplicate-action",
                id: action.id,
              },
              {
                method: "post",
              }
            );
          }}
        >
          <Duplicate className="w-3 transition hover:text-gray-300" />
        </button>
        <button
          title="Excluir ação"
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
