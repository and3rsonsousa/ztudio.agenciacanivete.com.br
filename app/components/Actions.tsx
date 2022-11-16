import {
  ArrowSmallRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon as Duplicate,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  Link,
  useFetcher,
  useMatches,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";

import {
  CheckBadgeIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon as Trash,
} from "@heroicons/react/24/outline";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { AccountModel, ActionModel, ItemModel } from "~/lib/models";
import Button from "./Forms/Button";

export const Action = ({ action }: { action: ActionModel }) => {
  const matches = useMatches();
  const fetcher = useFetcher();
  const url = matches[1].data.url;
  const tags: ItemModel[] = matches[1].data.tags;
  const status: ItemModel[] = matches[1].data.status;

  const navigate = useNavigate();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <HoverCard.Root>
          <HoverCard.Trigger>
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
              className={`action-line py-1 px-2 duration-500 bg-${action.status.slug} bg-${action.status.slug}-hover flex cursor-pointer items-center justify-between gap-2`}
              // title={`${action.name} ( ${action.Account?.name} )`}
              onClick={() => {
                navigate(
                  `/dashboard/${action.account.slug}/action/${action.id}?redirectTo=${url}`
                );
              }}
            >
              <div className="flex items-center gap-1 overflow-hidden">
                <div
                  className={`text-xx hidde rounded-l font-semibold uppercase text-white/50 2xl:block`}
                >
                  {action.tag.name.slice(0, 3)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap  text-xs font-medium">
                  {action.name}
                </div>
              </div>
              <div className="text-xx hidden font-medium opacity-75 2xl:block">
                {dayjs(action.date).format(
                  "H[h]".concat(
                    dayjs(action.date).format("mm") !== "00" ? "mm" : ""
                  )
                )}
              </div>
            </div>
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content className="max-w-xs rounded bg-gray-800 p-4 text-sm font-light text-gray-300 antialiased dark:text-gray-700">
              <div className="mb-1 font-medium">{action.name}</div>
              {action.description && (
                <div className="text-xx mb-1 leading-tight line-clamp-6">
                  {action.description}
                </div>
              )}
              <div className="text-xx flex gap-4">
                <div>
                  {dayjs(action.date).format(
                    "HH[h]".concat(
                      dayjs(action.date).format("mm") === "00" ? "" : "mm"
                    )
                  )}
                </div>
                <div>{action.account?.name}</div>
                <div className="flex items-center gap-1">
                  <div
                    className={`h-1 w-1 bg-${action.tag?.slug} rounded-full`}
                  ></div>
                  <div>{action.tag?.name}</div>
                </div>
              </div>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="dropdown-content w-36">
          <ContextMenu.Item asChild>
            <Link
              to={`/dashboard/${action.account.slug}/action/${action.id}`}
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
                  action: "/handle-action",
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
                  action: "/handle-action",
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
                          action: "/handle-action",
                        }
                      );
                    }}
                    className="dropdown-item item-small flex items-center gap-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full bg-${tag.slug}`}
                    ></div>
                    <div className="flex-shrink-0 flex-grow">{tag.name}</div>
                    {action.tag.id === tag.id && (
                      <CheckCircleIcon className="w-4" />
                    )}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
              <CheckBadgeIcon className="w-4" />
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
                          action: "update-action-status",
                          id: action.id,
                          status: stat.id,
                        },
                        {
                          method: "post",
                          action: "/handle-action",
                        }
                      );
                    }}
                    className="dropdown-item item-small flex items-center gap-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full bg-${stat.slug}`}
                    ></div>
                    <div className="flex-shrink-0 flex-grow">{stat.name}</div>
                    {action.status.id === stat.id && (
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

export const ActionMedium = ({
  action,
  showDateAndTime,
  hideAccount,
}: {
  action: ActionModel;
  showDateAndTime?: boolean;
  hideAccount?: boolean;
}) => {
  const matches = useMatches();
  const fetcher = useFetcher();
  // const tags: ItemModel[] = matches[1].data.tags;
  // const status: ItemModel[] = matches[1].data.status;
  const acccounts: AccountModel[] = matches[1].data.accounts;
  const account = acccounts.filter(
    (account) => account.id === action.account.id
  )[0];
  // const tag = tags.filter((tag) => tag.id === action.tag)[0];
  // const stat = action.Status;
  const navigate = useNavigate();
  const date = dayjs(action.date);

  return (
    <div
      className={`action-medium group relative mb-2 flex flex-nowrap justify-between gap-4 rounded border-l-4 bg-gray-50 p-4 transition duration-500 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-${action.status.slug}`}
    >
      <div className="overflow-hidden">
        <div className="text-sm font-normal dark:text-gray-300">
          {action.name}
        </div>
        {action.campaign && (
          <Link
            to={`/dashboard/${action.account.slug}/campaign/${action.campaign}`}
            className="text-xx mb-2 flex items-center hover:underline"
          >
            <ArrowSmallRightIcon className="w-4" />
            <span>{action.campaign.name}</span>
          </Link>
        )}
        {action.description ? (
          <div className="text-xx mb-2 line-clamp-3">{action.description}</div>
        ) : null}
        <div className="text-xx flex gap-4 overflow-hidden opacity-75">
          <div className="whitespace-nowrap">
            {showDateAndTime
              ? date.format(
                  "D/M/YY [às] H[h]".concat(
                    date.format("mm") !== "00" ? "mm" : ""
                  )
                )
              : date.format(
                  "H[h]".concat(date.format("mm") !== "00" ? "mm" : "")
                )}
          </div>
          {!hideAccount && (
            <div className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
              {account.name}
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className={`h-1 w-1 rounded-full bg-${action.tag.slug}`}></div>
            <div>{action.tag.name}</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 flex translate-y-4  justify-between gap-2 rounded bg-gray-800 p-2 text-gray-400 opacity-0 transition group-hover:translate-y-0  group-hover:opacity-100">
        <button
          title="Editar ação"
          onClick={() => {
            navigate(`/dashboard/${action.account.slug}/action/${action.id}`);
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
                action: "/handle-action",
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
                action: "/handle-action",
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

export const ActionGrid = ({
  action,
  index,
}: {
  action: ActionModel;
  index: number;
}) => {
  const context: {
    date: {
      setDateOfTheDay: (date: Dayjs) => void;
    };
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: (b?: boolean) => void;
    };
  } = useOutletContext();

  return action.name === "support" ? (
    <div
      className={`grid aspect-square place-items-center border-b border-r bg-gray-100 text-center dark:border-gray-800  dark:bg-gray-900`}
    >
      <div>
        <Button
          link
          large
          icon
          onClick={() => {
            context.date.setDateOfTheDay(dayjs(action.date));
            context.actions.setOpenDialogAction(true);
          }}
        >
          <DocumentPlusIcon />
        </Button>
        {/* <div className="text-xx uppercase tracking-wide">NOVA AÇÃO</div> */}
      </div>
    </div>
  ) : (
    <div
      className={`text-xx flex aspect-square flex-col justify-between border-b p-2 text-center leading-tight dark:border-gray-800 ${
        action.status.id === "a448e17d-05ba-4ad0-9990-773f9384d15e"
          ? " bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-500"
          : ""
      } ${index + (1 % 3) === 0 ? "" : "border-r"}`}
    >
      <div></div>
      <div>{action.name}</div>
      <div>{dayjs(action.date).format("DD/MM")}</div>
    </div>
  );
};
