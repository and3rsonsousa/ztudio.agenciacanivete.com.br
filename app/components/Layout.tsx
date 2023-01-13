import {
  BriefcaseIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Link,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { fade, scaleUp } from "~/lib/animations";
import { SHORTCUTS } from "~/lib/constants";
import type { AccountModel, ContextType, PersonModel } from "~/lib/models";
import Button from "./Button";
import ActionDialog from "./Dialogs/ActionDialog";
import CampaignDialog from "./Dialogs/CampaignDialog";
import CelebrationDialog from "./Dialogs/CelebrationDialog";
import { Theme, useTheme } from "./ThemeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const { slug } = useParams();

  const person: PersonModel = matches[1].data.person;
  const accounts: AccountModel[] = matches[1].data.accounts;
  const context: ContextType = useOutletContext();

  const [showShortcuts, setShowShorcuts] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchParams =
    params.get("month") !== null ? `?month=${params.get("month")}` : "";

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        if (event.shiftKey) {
          setShowShorcuts((prev: boolean) => !prev);
        } else {
          setTimeout(() => {
            context.shortcut.set(false);
          }, 2000);
        }
        context.shortcut.set((prev: boolean) => !prev);
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [context]);

  return (
    <div className="flex h-screen w-full flex-col  lg:flex-row">
      {/* Header */}
      <div
        className={`no-scrollbars fixed z-30 flex h-12 w-full flex-shrink-0 items-center justify-between bg-gray-800/50 backdrop-blur-xl lg:relative lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:overflow-y-auto lg:bg-transparent lg:py-4  ${
          context.sidebar.open ? "lg:w-48" : "lg:w-16"
        }`}
      >
        <div className="lg:w-full">
          {/* Logo */}
          <div className={`-mt-1 max-w-[8rem] p-2 lg:pt-0`}>
            <Link
              to={`/dashboard`}
              className=" block rounded p-2 outline-none focus:ring-2 focus:ring-brand"
            >
              {context.sidebar.open ? (
                <img src="/logo.png" alt="STUDIO" />
              ) : (
                <img src="/ico.png" className="mx-auto h-6" alt="STUDIO" />
              )}
            </Link>
          </div>
          {/* Clientes large view */}

          <div className="hidden p-2 lg:block">
            {accounts.map((account) => (
              <div key={account.id}>
                <Link
                  to={`/dashboard/${account.slug}/${searchParams}`}
                  className={`${
                    context.sidebar.open
                      ? "overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold "
                      : "text-xx text-center font-bold uppercase"
                  } block  rounded-lg p-2  focus:outline-none focus:ring-2 focus:ring-brand ${
                    slug === account.slug
                      ? "bg-brand text-white ring-offset-2 ring-offset-white dark:ring-offset-gray-1000"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {context.sidebar.open ? account.name : account.short}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="flex pr-2 lg:flex lg:w-full lg:flex-col lg:p-2">
          {/* Clientes mobile */}
          <div className="lg:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2">
                  <BriefcaseIcon className="w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content mr-2">
                  {accounts.map((account) => (
                    <DropdownMenu.Item key={account.id} asChild>
                      <Link
                        to={`/dashboard/${account.slug}/${searchParams}`}
                        className="dropdown-item item-small block"
                      >
                        {account.name}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          {/* Search */}
          <div className="lg:p-2">
            <button
              onClick={() => {
                context.search.set(true);
              }}
              className="flex w-full cursor-text items-center gap-2 rounded-lg px-3 py-2 outline-none lg:bg-gray-100 lg:dark:bg-gray-800"
            >
              {context.sidebar.open && (
                <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 lg:flex">
                  <div>Pesquisar</div>
                </div>
              )}
              <div className={`${context.sidebar.open ? "ml-auto" : "-ml-1"}`}>
                <MagnifyingGlassIcon className="w-4" />
              </div>
            </button>
          </div>
          {/* User Menu */}
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-2 rounded p-2 outline-none lg:w-full">
                {context.sidebar.open && (
                  <div className="hidden text-xs font-semibold lg:block">
                    {person.name}
                  </div>
                )}

                <UserIcon
                  className={`${context.sidebar.open ? "ml-auto" : "ml-2"} w-4`}
                />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content mr-4" loop>
                  {/* Theme Switcher */}
                  <div className="flex items-center justify-between gap-2">
                    <ThemeSwitcher />
                  </div>

                  <hr className="dropdown-hr" />
                  {/* Minha Conta */}
                  <DropdownMenu.Label className="dropdown-label">
                    minha conta
                  </DropdownMenu.Label>
                  {/* Meus Dados */}
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/dashboard/me"
                      className="dropdown-item item-small block"
                    >
                      Meus dados
                    </Link>
                  </DropdownMenu.Item>
                  {/* Lixeira */}
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/dashboard/trash"
                      className="dropdown-item item-small block"
                    >
                      Lixeira
                    </Link>
                  </DropdownMenu.Item>
                  {/* Sair */}
                  <DropdownMenu.Item
                    className="dropdown-item item-small"
                    onSelect={() => navigate("/signout")}
                  >
                    Sair
                  </DropdownMenu.Item>
                  {/* Admin */}
                  {person.admin && (
                    <>
                      <hr className="dropdown-hr" />
                      <DropdownMenu.Label className="dropdown-label">
                        admin
                      </DropdownMenu.Label>
                      {/* Clientes / Accounts  */}
                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="dropdown-item item-small">
                          <div className="flex items-center">
                            <div>Clientes</div>
                            <ChevronRightIcon className="ml-auto w-4" />
                          </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent className="dropdown-content">
                            <DropdownMenu.Item asChild>
                              <Link
                                to={`/dashboard/admin/accounts`}
                                className="dropdown-item item-small block"
                              >
                                Ver Clientes
                              </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                              <Link
                                to={`/dashboard/admin/accounts/new`}
                                className="dropdown-item item-small block"
                              >
                                Novo Cliente
                              </Link>
                            </DropdownMenu.Item>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Sub>
                      {/* Usuários */}
                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="dropdown-item item-small">
                          <div className="flex items-center">
                            <div>Usuários</div>
                            <ChevronRightIcon className="ml-auto w-4" />
                          </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent className="dropdown-content">
                            <DropdownMenu.Item asChild>
                              <Link
                                to={`/dashboard/admin/users/`}
                                className="dropdown-item item-small block"
                              >
                                Ver Usuários
                              </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                              <Link
                                to={`/dashboard/admin/users/new`}
                                className="dropdown-item item-small block"
                              >
                                Novo Usuário
                              </Link>
                            </DropdownMenu.Item>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Sub>

                      <hr className="dropdown-hr" />
                      {/* Roadmap */}
                      <DropdownMenu.Item asChild>
                        <Link
                          to={`/dashboard/roadmap`}
                          className="dropdown-item item-small block"
                        >
                          Roadmap
                        </Link>
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          {/* Create Action on Mobile */}
          <div className="ml-2 lg:hidden">
            <Button
              primary
              className="p-2 text-sm sm:p-1.5 sm:px-4"
              onClick={() => context.actions.set(true)}
            >
              <span className="hidden sm:block">Nova Ação</span>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-12 flex-auto lg:mt-0">{children}</div>
      {/* Shortcut */}
      <Dialog.Root open={showShortcuts} onOpenChange={setShowShorcuts}>
        <AnimatePresence>
          {showShortcuts && (
            <Dialog.Portal forceMount>
              <Dialog.Content forceMount className="dialog">
                <motion.div
                  className="rounded-xl bg-white/50 p-4 font-light antialiased backdrop-blur-xl dark:bg-gray-1000/50 md:p-8"
                  {...fade(0.1)}
                >
                  <div className="mb-4 text-2xl font-medium">Shortcuts</div>
                  <div className="grid-cols-2 gap-8 md:grid">
                    {[
                      {
                        title: "Ações",
                        shorcuts: [
                          { ...SHORTCUTS.NEW_ACTION },
                          { ...SHORTCUTS.NEW_CELEBRATION },
                          { ...SHORTCUTS.NEW_CAMPAIGN },
                          { ...SHORTCUTS.SIDEBAR },
                          { ...SHORTCUTS.PRIORITY },
                        ],
                      },
                      {
                        title: "Filtros",
                        shorcuts: [
                          { ...SHORTCUTS.ARRANGE_ALL },
                          { ...SHORTCUTS.ARRANGE_CATEGORIES },
                          { ...SHORTCUTS.ARRANGE_ACCOUNTS },
                          { ...SHORTCUTS.FILTER_FEED },
                          { ...SHORTCUTS.FILTER_REELS },
                          { ...SHORTCUTS.FILTER_TASK },
                          { ...SHORTCUTS.FILTER_STORIES },
                          { ...SHORTCUTS.FILTER_MEETING },
                          { ...SHORTCUTS.FILTER_PRINT },
                          { ...SHORTCUTS.FILTER_TIKTOK },
                          { ...SHORTCUTS.FILTER_FINANCIAL },
                        ],
                      },
                    ].map((column, index) => (
                      <div key={index} className=" text-xs">
                        <div className="mb-2 text-xs font-bold uppercase">
                          {column.title}
                        </div>
                        {column.shorcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-1"
                          >
                            <div className="w-14 font-bold">
                              {shortcut.shortcut}
                            </div>
                            <div className="opacity-75">{shortcut.does}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <>
        {/* Dialog for Celebration */}
        <Dialog.Root
          open={context.celebrations.open}
          onOpenChange={(v: boolean) => {
            context.celebrations.set(v);
          }}
        >
          <AnimatePresence>
            {context.celebrations.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <CelebrationDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Actions */}
        <Dialog.Root
          open={context.actions.open}
          onOpenChange={context.actions.set}
        >
          <AnimatePresence>
            {context.actions.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <ActionDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Campaign */}
        <Dialog.Root
          open={context.campaigns.open}
          onOpenChange={context.campaigns.set}
        >
          <AnimatePresence>
            {context.campaigns.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <CampaignDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Search */}
        <Dialog.Root
          open={context.search.open}
          onOpenChange={context.search.set}
        >
          <AnimatePresence>
            {context.search.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog dialog-search">
                  <motion.div
                    className="dialog-content top-1/3 w-[36rem] max-w-lg font-light antialiased "
                    {...scaleUp()}
                  >
                    <input type="text" className="field-default" />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {context.shortcut.open && (
          <Shortcut
            context={context}
            close={(value: boolean) => {
              context.shortcut.set(value);
              setShowShorcuts(value);
            }}
          />
        )}
      </>
    </div>
  );
}

function ThemeSwitcher() {
  // const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <DropdownMenu.Item
      className="dropdown-item item-small flex items-center gap-2"
      onSelect={() => {
        toggleTheme();
        // if (theme === "dark") {
        //   document.body.classList.remove("dark");
        //   localStorage.removeItem("theme");
        //   setTheme("");
        // } else {
        //   document.body.classList.add("dark");
        //   localStorage.setItem("theme", "dark");
        //   setTheme("dark");
        // }
      }}
    >
      <div>Modo {theme === "dark" ? "claro" : "escuro"}</div>
      <div className="ml-8">
        {theme === "dark" ? (
          <SunIcon className="w-4" />
        ) : (
          <MoonIcon className="w-4" />
        )}
      </div>
    </DropdownMenu.Item>
  );
}

function Shortcut({
  context,
  close,
}: {
  context: ContextType;
  close: (value: boolean) => void;
}) {
  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      event.preventDefault();
      const key = event.key.toUpperCase();

      switch (key) {
        case SHORTCUTS.NEW_ACTION.shortcut:
          context.actions.set((prev) => !prev);
          break;
        case SHORTCUTS.NEW_CELEBRATION.shortcut:
          context.celebrations.set((prev) => !prev);
          break;
        case SHORTCUTS.NEW_CAMPAIGN.shortcut:
          context.campaigns.set((prev) => !prev);
          break;
        case SHORTCUTS.SIDEBAR.shortcut:
          context.sidebar.set((prev) => !prev);
          break;
        case SHORTCUTS.SEARCH.shortcut:
          context.search.set((prev) => !prev);
          break;
        case SHORTCUTS.PRIORITY.shortcut:
          context.priority.set((value) => !value);
          break;
        case SHORTCUTS.ARRANGE_ALL.shortcut:
          context.arrange.set(SHORTCUTS.ARRANGE_ALL.value);
          break;
        case SHORTCUTS.ARRANGE_CATEGORIES.shortcut:
          context.arrange.set(SHORTCUTS.ARRANGE_CATEGORIES.value);
          break;
        case SHORTCUTS.ARRANGE_ACCOUNTS.shortcut:
          context.arrange.set(SHORTCUTS.ARRANGE_ACCOUNTS.value);
          break;
        case SHORTCUTS.FILTER_ALL.shortcut:
          context.filter.set(SHORTCUTS.FILTER_ALL.value);
          break;
        case SHORTCUTS.FILTER_FEED.shortcut:
          context.filter.set(SHORTCUTS.FILTER_FEED.value);
          break;
        case SHORTCUTS.FILTER_REELS.shortcut:
          context.filter.set(SHORTCUTS.FILTER_REELS.value);
          break;
        case SHORTCUTS.FILTER_TASK.shortcut:
          context.filter.set(SHORTCUTS.FILTER_TASK.value);
          break;
        case SHORTCUTS.FILTER_STORIES.shortcut:
          context.filter.set(SHORTCUTS.FILTER_STORIES.value);
          break;
        case SHORTCUTS.FILTER_MEETING.shortcut:
          context.filter.set(SHORTCUTS.FILTER_MEETING.value);
          break;
        case SHORTCUTS.FILTER_PRINT.shortcut:
          context.filter.set(SHORTCUTS.FILTER_PRINT.value);
          break;
        case SHORTCUTS.FILTER_TIKTOK.shortcut:
          context.filter.set(SHORTCUTS.FILTER_TIKTOK.value);
          break;
        case SHORTCUTS.FILTER_FINANCIAL.shortcut:
          context.filter.set(SHORTCUTS.FILTER_FINANCIAL.value);
          break;
        default:
          alert("Not implemented");
          break;
      }
      close(false);
    }

    window.addEventListener("keydown", keyDown);

    return () => window.removeEventListener("keydown", keyDown);
  }, [close, context]);

  return <div></div>;
}
