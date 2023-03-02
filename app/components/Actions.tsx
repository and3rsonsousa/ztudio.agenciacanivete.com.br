import * as ContextMenu from "@radix-ui/react-context-menu";

import type { FetcherWithComponents } from "@remix-run/react";

import {
  Link,
  useFetcher,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import {
  ArrowDownRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Edit,
  FilePlus2,
  Heart,
  HelpCircle,
  Music2,
  Play,
  Printer,
  RotateCw,
  Trash2,
  Users,
} from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { fade } from "~/lib/animations";
import type {
  AccountModel,
  ActionModel,
  ContextType,
  ItemModel,
} from "~/lib/models";
import Button from "./Button";
import Exclamation from "./Exclamation";
import type { SupportType } from "./InstagramGrid";

dayjs.extend(relativeTime);

export const ActionLine = ({ action }: { action: ActionModel }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const matches = useMatches();
  const url = matches[1].data.url;
  const { slug } = useParams();

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
            ele.classList.add("dragging");

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
          <IsLate action={action} />
          <div className="action-line__left">
            {/* Icon For Tags */}
            {<TagIcons type={action.tag.slug} className="h-3 w-3 opacity-60" />}
            {/* Name */}
            <div className="action-line__name">{action.name}</div>
            {/* Account Short */}
            {!slug && (
              <div className="action-line__short">{action.account.short}</div>
            )}
            {/* Account Name for mobile */}
            <div className="action-line__name_mobile">
              {action.account.name.slice(0, 3)}
            </div>
          </div>
          {/* Time */}
          <div className="action-line__right">
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
              <motion.div className="dropdown-content w-36" {...fade(0.2)}>
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
  wrap,
}: {
  action: ActionModel;
  showDateAndTime?: boolean;
  hideAccount?: boolean;
  wrap?: boolean;
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
          className={`action-medium @container ${action.status.slug}`}
        >
          <div>
            <div className="text-sm font-normal">{action.name}</div>
            {action.campaign && (
              <Link
                to={`/dashboard/${action.account.slug}/campaign/${action.campaign}`}
                className="mb-2 flex items-center text-xx hover:underline"
              >
                <ArrowDownRight className="w-4" />
                <span>{action.campaign.name}</span>
              </Link>
            )}
          </div>
          {action.description?.trim().length ? (
            <div className="text-xx line-clamp-3">{action.description}</div>
          ) : null}
          {/* Horário - Cliente - Tag - Status */}
          <div
            className={`flex ${
              wrap ? "flex-wrap" : ""
            } gap-1 overflow-hidden text-xx`}
          >
            {/* Horário */}
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
            {/* Cliente */}
            {!hideAccount && (
              <div className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap font-medium uppercase tracking-wider">
                {account.name}
              </div>
            )}
            <div className="flex items-center gap-1">
              <div
                className={`rounded-full px-2 text-xx uppercase tracking-wide text-white bg-${action.tag.slug} font-bold`}
              >
                {action.tag.short}
              </div>
              <div
                className={`rounded-full px-2 text-xx uppercase tracking-wide text-white bg-${action.status.slug} w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold`}
              >
                {action.status.short}
              </div>
            </div>
          </div>
          {/* <div className="mt-1 flex gap-4 overflow-hidden text-xx">{}</div> */}
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
  const context: ContextType = useOutletContext();
  const fetcher = useFetcher();

  return action.name === "support" ? (
    <div
      className={`grid aspect-square place-items-center border border-white  bg-brand text-center text-white dark:border-gray-1000 ${
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
            context.date.set(dayjs(action.date));
            context.actions.set(true);
          }}
        >
          <FilePlus2 />
        </Button>
      </div>
    </div>
  ) : (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          className={`flex aspect-square flex-col justify-between border border-white p-2 text-center text-xx leading-tight dark:border-gray-1000  ${
            (action as ActionModel).status.id ===
            "a448e17d-05ba-4ad0-9990-773f9384d15e"
              ? " bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-400"
              : " bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
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
          <div className="line-clamp-5">{action.name}</div>
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
        actions.reverse().map((action, index) => {
          const header =
            currentMonth !== dayjs(action.date).format("MM") ? (
              <h4
                className="col-span-full py-4 first-letter:capitalize"
                key={index}
              >
                {dayjs(action.date).format("MMMM [de] YYYY")}
              </h4>
            ) : null;
          currentMonth = dayjs(action.date).format("MM");
          return (
            <React.Fragment key={index}>
              {header}
              <ActionMedium
                action={action}
                hideAccount={true}
                showDateAndTime={true}
              />
            </React.Fragment>
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
  const trash = matches[1].data.url?.includes("trash");

  return (
    <>
      {/* Editar */}
      <ContextMenu.Item asChild>
        <Link
          to={`/dashboard/${action.account.slug}/action/${action.id}`}
          className="dropdown-item item-small flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Edit className="w-4" /> <div>Editar</div>
          </div>
          <div className="opacity-50">E</div>
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
          <Copy className="w-4 shrink-0" />
          <div>Duplicar</div>
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger className="dropdown-item ml-auto py-1.5 pr-4 pl-2">
            <ChevronRight className="w-4" />
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
              action: trash ? "delete-action-trash" : "delete-action",
              id: action.id,
            },
            {
              method: "post",
              action: "/handle-action",
            }
          );
        }}
        className="dropdown-item item-small flex items-center justify-between gap-2"
        textValue="Xclude"
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-4" /> <div>Excluir</div>
        </div>
        <div className="opacity-50">X</div>
      </ContextMenu.Item>
      {/* Adiar */}
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger className="dropdown-item item-small flex items-center gap-2">
          <Clock className="w-4" />
          <div>Adiar</div>
          <ChevronRight className="ml-auto w-4" />
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
        <ContextMenu.SubTrigger
          textValue="Tag"
          className="dropdown-item item-small flex items-center gap-2"
        >
          {/* <TagIcon className="w-4" /> */}
          <div
            className={`mr-2 h-2 w-2 rounded-full bg-${action.tag.slug}`}
          ></div>
          <div>{action.tag.name}</div>
          <ChevronRight className="ml-auto w-4" />
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
                {action.tag.id === tag.id && <CheckCircle className="w-4" />}
              </ContextMenu.Item>
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
      {/* Status */}
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger
          textValue="Status"
          className="dropdown-item item-small flex items-center gap-2"
        >
          {/* <CheckBadgeIcon className="w-4" /> */}
          <div
            className={`mr-2 h-2 w-2 rounded-full bg-${action.status.slug}`}
          ></div>
          <div>{action.status.name}</div>
          <ChevronRight className="ml-auto w-4" />
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
                  <CheckCircle className="w-4" />
                )}
              </ContextMenu.Item>
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
    </>
  );
};

const IsLate = ({ action }: { action: ActionModel }) =>
  dayjs(action.date).isBefore(dayjs()) &&
  action.status.slug !== "accomplished" ? (
    <div
      className="absolute -left-1 top-2 h-3 w-3 animate-bounce rounded-full border-2 border-white bg-error-500 dark:border-gray-1000"
      title={`Atrasado ${dayjs(action.date).fromNow()}`}
    ></div>
  ) : null;

export const TagIcons = ({
  type,
  className,
}: {
  type: string;
  className: string;
}) => {
  switch (type) {
    case "feed":
      return <Heart className={className} />;
    case "reels":
      return <Play className={className} />;
    case "task":
      return <CheckCircle className={className} />;
    case "stories":
      return <RotateCw className={className} />;
    case "meeting":
      return <Users className={className} />;
    case "print":
      return <Printer className={className} />;
    case "tiktok":
      return <Music2 className={className} />;
    case "financial":
      return <DollarSign className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
