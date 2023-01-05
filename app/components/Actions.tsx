import {
  ArrowSmallRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

import * as ContextMenu from "@radix-ui/react-context-menu";

import type { FetcherWithComponents } from "@remix-run/react";
import {
  Link,
  useFetcher,
  useMatches,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";

import {
  ClockIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
  TrashIcon as Trash,
} from "@heroicons/react/24/outline";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { scaleUp } from "~/lib/animations";
import type { AccountModel, ActionModel, ItemModel } from "~/lib/models";
import Button from "./Button";
import Exclamation from "./Exclamation";
import type { SupportType } from "./InstagramGrid";
import { shortWord } from "~/lib/functions";

export const ActionLine = ({ action }: { action: ActionModel }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const matches = useMatches();
  const url = matches[1].data.url;
  const fetcher = useFetcher();

  const navigate = useNavigate();

  return (
    <ContextMenu.Root onOpenChange={setShowContextMenu}>
      <ContextMenu.Trigger>
        <div
          role="button"
          tabIndex={0}
          data-date={action.date}
          data-id={action.id}
          draggable
          onDragStart={(e) => {
            const ele = e.target as HTMLElement;
            ele.classList.add("dragging-base");

            const ghost = ele.cloneNode(true) as HTMLElement;
            ghost.style.width = `${ele.offsetWidth}px`;
            ghost.style.height = `${ele.offsetHeight}px`;
            ghost.style.position = "absolute";
            ghost.style.top = "0px";
            ghost.style.left = "0px";
            // ghost.style.offset = ".2";
            ghost.style.zIndex = "-1";
            ghost.style.pointerEvents = "none";

            document.body.appendChild(ghost);
            e.dataTransfer?.setDragImage(
              ghost,
              ele.offsetWidth / 2,
              ele.offsetHeight / 2
            );

            setTimeout(() => {
              ghost.parentNode?.removeChild(ghost);
            });
          }}
          onDragEnd={(e) => {
            let ele = e.target as HTMLElement;
            ele.classList.remove("dragging");
          }}
          className={`action-line bg-${action.status.slug} bg-${action.status.slug}-hover  @container`}
          onClick={() => {
            navigate(
              `/dashboard/${action.account.slug}/action/${action.id}?redirectTo=${url}`
            );
          }}
          title={`${action.name} - ${action.account.name}`}
        >
          <div className="flex w-full items-center gap-1 overflow-hidden">
            <div
              className={`hidden w-7 shrink-0 grow-0 text-center text-[9px] font-medium uppercase tracking-wider opacity-60 @[120px]:block`}
            >
              {action.account.short}
            </div>
            <div className="hidden w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal sm:block ">
              {action.name}
            </div>
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium uppercase sm:hidden">
              {action.account.name.slice(0, 3)}
            </div>
          </div>
          <div className="text-xx hidden text-center font-medium opacity-75 @[140px]:block">
            {dayjs(action.date).format(
              "H[h]".concat(
                dayjs(action.date).format("mm") !== "00" ? "mm" : ""
              )
            )}
          </div>
        </div>
      </ContextMenu.Trigger>
      <AnimatePresence>
        {showContextMenu && (
          <ContextMenu.Portal forceMount>
            <ContextMenu.Content asChild forceMount loop>
              <motion.div className="dropdown-content w-36" {...scaleUp(0.2)}>
                {action.status.id !==
                  "a448e17d-05ba-4ad0-9990-773f9384d15e" && (
                  <>
                    {/* Caso o item não esteja concluído, exibe a opção de concluir mais rápido */}
                    <ContextMenu.Item
                      onSelect={(event: Event) => {
                        fetcher.submit(
                          {
                            action: "update-action-status",
                            id: action.id,
                            status: "a448e17d-05ba-4ad0-9990-773f9384d15e",
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
                        className={`bg-accomplished mx-1 h-2 w-2 rounded-full`}
                      ></div>
                      <div className="flex-shrink-0 flex-grow">Concluído</div>
                    </ContextMenu.Item>
                    <hr className="dropdown-hr" />
                  </>
                )}

                <ContextMenuItems action={action} fetcher={fetcher} />
              </motion.div>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        )}
      </AnimatePresence>
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
  const fetcher = useFetcher();
  const matches = useMatches();
  const acccounts: AccountModel[] = matches[1].data.accounts;
  const account = acccounts.filter(
    (account) => account.id === action.account.id
  )[0];

  const date = dayjs(action.date);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          tabIndex={0}
          className={`action-medium group ${action.status.slug}`}
        >
          {/* <div className="absolute top-1/2 -left-1 -translate-y-1/2">
            <div
              className={` h-6 w-1 rounded-tl-full bg-${action.status.slug}  `}
            ></div>
            <div
              className={` h-6 w-1 rounded-bl-full bg-${action.tag.slug}  `}
            ></div>
          </div> */}

          <div className="overflow-hidden">
            <div className="mb-1">
              <div className="font-norma text-sm">{action.name}</div>
              {action.campaign && (
                <Link
                  to={`/dashboard/${action.account.slug}/campaign/${action.campaign}`}
                  className="text-xx mb-2 flex items-center hover:underline"
                >
                  <ArrowSmallRightIcon className="w-4" />
                  <span>{action.campaign.name}</span>
                </Link>
              )}
            </div>
            {action.description?.trim().length ? (
              <div className="text-xx line-clamp-3">{action.description}</div>
            ) : null}
            <div className="text-xx mt-1 flex gap-4 overflow-hidden">
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
                <div
                  className={`text-xx rounded-full px-2 uppercase tracking-wide text-white bg-${action.tag.slug} font-bold`}
                >
                  {shortWord(action.tag.name)}
                </div>
                <div
                  className={`text-xx rounded-full px-2 uppercase tracking-wide text-white bg-${action.status.slug} w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold`}
                >
                  {shortWord(action.status.name)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="dropdown-content mt-4 w-36">
          <ContextMenuItems action={action} fetcher={fetcher} />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export const ActionGrid = ({
  action,
  index,
  total,
}: {
  action: ActionModel | SupportType;
  index: number;
  total: number;
}) => {
  const context: {
    date: {
      setDateOfTheDay: (date: Dayjs) => void;
    };
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: React.Dispatch<React.SetStateAction<boolean>>;
    };
  } = useOutletContext();
  const fetcher = useFetcher();

  return action.name === "support" ? (
    <div
      className={`grid aspect-square place-items-center border border-gray-1000 bg-gray-100 text-center dark:bg-gray-900 ${
        index === 0 ? "rounded-tl-xl" : ""
      }`}
    >
      <div>
        <Button
          link
          large
          squared
          icon
          onClick={() => {
            context.date.setDateOfTheDay(dayjs(action.date));
            context.actions.setOpenDialogAction(true);
          }}
        >
          <DocumentPlusIcon />
        </Button>
      </div>
    </div>
  ) : (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          className={`text-xx flex aspect-square flex-col justify-between border border-gray-1000 p-2 text-center leading-tight  ${
            (action as ActionModel).status.id ===
            "a448e17d-05ba-4ad0-9990-773f9384d15e"
              ? " bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-400"
              : " bg-white dark:bg-gray-800 dark:text-gray-200"
          } 
          ${index === 0 ? "rounded-tl-xl" : ""} 
          ${
            (total >= 3 && index === 2) || (total < 3 && index + 1 === total)
              ? "rounded-tr-xl"
              : ""
          } 
          ${
            total - index === 3 || (total < 3 && index === 0)
              ? "rounded-bl-xl"
              : ""
          } 
          ${total - index === 1 ? "rounded-br-xl" : ""}`}
        >
          <div></div>
          <div>{action.name}</div>
          <div>{dayjs(action.date).format("DD/MM")}</div>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="dropdown-content">
          <ContextMenuItems action={action as ActionModel} fetcher={fetcher} />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export const Actions = ({ actions }: { actions: ActionModel[] }) => {
  let currentMonth = "";
  return (
    <div className="no-scrollbars grid gap-x-4 gap-y-2 overflow-hidden overflow-y-auto p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
      {Array.isArray(actions) && actions.length > 0 ? (
        actions.reverse().map((action) => {
          const header =
            currentMonth !== dayjs(action.date).format("MM") ? (
              <h4 className="col-span-full py-4 first-letter:capitalize">
                {dayjs(action.date).format("MMMM [de] YYYY")}
              </h4>
            ) : null;
          currentMonth = dayjs(action.date).format("MM");
          return (
            <>
              {header}
              <ActionMedium
                key={action.id}
                action={action}
                hideAccount={true}
                showDateAndTime={true}
              />
            </>
          );
        })
      ) : (
        <Exclamation type="alert" icon>
          Nenhum item para exibir
        </Exclamation>
      )}
    </div>
  );
};

const ContextMenuItems = ({
  action,
  fetcher,
}: {
  action: ActionModel;
  fetcher: FetcherWithComponents<any>;
}) => {
  const matches = useMatches();
  const tags: ItemModel[] = matches[1].data.tags;
  const status: ItemModel[] = matches[1].data.status;
  const accounts: AccountModel[] = matches[1].data.accounts;

  return (
    <>
      {/* Editar */}
      <ContextMenu.Item asChild>
        <Link
          to={`/dashboard/${action.account.slug}/action/${action.id}`}
          className="dropdown-item item-small flex items-center gap-2"
        >
          <PencilSquareIcon className="w-4" /> <div>Editar</div>
        </Link>
      </ContextMenu.Item>
      {/* Duplicar */}
      <div className="flex">
        <ContextMenu.Item
          onSelect={() => {
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
          <DocumentDuplicateIcon className="w-4 shrink-0" />
          <div>Duplicar</div>
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger className="dropdown-item ml-auto py-1.5 pr-4 pl-2">
            <ChevronRightIcon className="w-4" />
          </ContextMenu.SubTrigger>
          <ContextMenu.Portal>
            <ContextMenu.SubContent className="dropdown-content">
              <ContextMenu.Label className="dropdown-label">
                Duplicar para a conta...
              </ContextMenu.Label>
              {accounts.map((account) => (
                <ContextMenu.Item
                  className="dropdown-item item-small"
                  key={account.id}
                  onSelect={(event: Event) => {
                    fetcher.submit(
                      {
                        action: "duplicate-action",
                        id: action.id,
                        account: account.id,
                      },
                      {
                        method: "post",
                        action: "/handle-action",
                      }
                    );
                  }}
                >
                  <div>{account.name}</div>
                </ContextMenu.Item>
              ))}
            </ContextMenu.SubContent>
          </ContextMenu.Portal>
        </ContextMenu.Sub>
      </div>
      {/* Excluir */}
      <ContextMenu.Item
        onSelect={(event: Event) => {
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
      {/* Adiar */}
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
          <ClockIcon className="w-4" />
          <div>Adiar</div>
          <ChevronRightIcon className="ml-auto w-4" />
        </ContextMenu.SubTrigger>
        <ContextMenu.Portal>
          <ContextMenu.SubContent className="dropdown-content w-36">
            {[
              {
                id: 1,
                name: "30 minutos",
                value: 30,
                unit: "minute",
              },
              { id: 3, name: "3 horas", value: 3, unit: "hour" },
              { id: 4, name: "9 horas", value: 9, unit: "hour" },
              { id: 5, name: "1 dia", value: 1, unit: "day" },
              { id: 6, name: "3 dias", value: 3, unit: "day" },
              { id: 7, name: "1 semana", value: 1, unit: "week" },
              { id: 8, name: "Próximo mês", value: 1, unit: "month" },
            ].map((delay) => (
              <ContextMenu.Item
                key={delay.id}
                onSelect={(event: Event) => {
                  fetcher.submit(
                    {
                      action: "update-delay",
                      id: action.id,
                      date: dayjs(action.date)
                        .add(delay.value, delay.unit as dayjs.ManipulateType)
                        .format("YYYY-MM-DD[T]HH:mm"),
                    },
                    {
                      method: "post",
                      action: "/handle-action",
                    }
                  );
                }}
                className="dropdown-item item-small"
              >
                <div>{delay.name}</div>
              </ContextMenu.Item>
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
      <hr className="dropdown-hr" />
      {/* Tags */}
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
          {/* <TagIcon className="w-4" /> */}
          <div
            className={`mr-2 h-2 w-2 rounded-full bg-${action.tag.slug}`}
          ></div>
          <div>{action.tag.name}</div>
          <ChevronRightIcon className="ml-auto w-4" />
        </ContextMenu.SubTrigger>
        <ContextMenu.Portal>
          <ContextMenu.SubContent className="dropdown-content w-36">
            {tags.map((tag) => (
              <ContextMenu.Item
                key={tag.id}
                onSelect={(event: Event) => {
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
                <div className={`h-2 w-2 rounded-full bg-${tag.slug}`}></div>
                <div className="flex-shrink-0 flex-grow">{tag.name}</div>
                {action.tag.id === tag.id && (
                  <CheckCircleIcon className="w-4" />
                )}
              </ContextMenu.Item>
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
      {/* Status */}
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
          {/* <CheckBadgeIcon className="w-4" /> */}
          <div
            className={`mr-2 h-2 w-2 rounded-full bg-${action.status.slug}`}
          ></div>
          <div>{action.status.name}</div>
          <ChevronRightIcon className="ml-auto w-4" />
        </ContextMenu.SubTrigger>
        <ContextMenu.Portal>
          <ContextMenu.SubContent className="dropdown-content w-36">
            {status.map((stat) => (
              <ContextMenu.Item
                key={stat.id}
                onSelect={(event: Event) => {
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
                <div className={`h-2 w-2 rounded-full bg-${stat.slug}`}></div>
                <div className="flex-shrink-0 flex-grow">{stat.name}</div>
                {action.status.id === stat.id && (
                  <CheckCircleIcon className="w-4" />
                )}
              </ContextMenu.Item>
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
    </>
  );
};
