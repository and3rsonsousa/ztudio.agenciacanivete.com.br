import {
  BriefcaseIcon,
  ChevronRightIcon,
  MoonIcon,
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
  useSearchParams,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { FocusRing } from "react-aria";
import { fade, scaleUp } from "~/lib/animations";
import type { AccountModel, PersonModel } from "~/lib/models";
import ActionDialog from "./Dialogs/ActionDialog";
import CampaignDialog from "./Dialogs/CampaignDialog";
import CelebrationDialog from "./Dialogs/CelebrationDialog";
import SearchBox from "./SearchBox";
import { Theme, useTheme } from "./ThemeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();

  const person: PersonModel = matches[1].data.person;
  const accounts: AccountModel[] = matches[1].data.accounts;
  const context: {
    search: {
      openDialogSearch: boolean;
      setOpenDialogSearch: (b?: boolean) => void;
    };
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: (b?: boolean) => void;
    };
    campaigns: {
      openDialogCampaign: boolean;
      setOpenDialogCampaign: (b?: boolean) => void;
    };
    celebrations: {
      openDialogCelebration: boolean;
      setOpenDialogCelebration: (b?: boolean) => void;
    };
  } = useOutletContext();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchParams =
    params.get("period") !== null && params.get("instagram") !== null
      ? `?period=${params.get("period")}&instagram`
      : params.get("period") !== null
      ? `?period=${params.get("period")}`
      : params.get("instagram") !== null
      ? `?instagram`
      : "";

  return (
    <div className="flex h-screen w-full flex-col  lg:flex-row">
      {/* Header */}
      <div className="no-scrollbars flex flex-shrink-0 items-center justify-between border-b dark:border-gray-800 lg:flex lg:w-48 lg:flex-col lg:overflow-hidden lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-4">
        <div className="lg:w-full">
          {/* Logo */}
          <div className="-mt-1 w-36 p-4 lg:pt-0">
            <Link
              to={`/dashboard`}
              className="-mt2 -ml-2 block rounded p-2 outline-none focus:ring-2 focus:ring-brand"
            >
              <img src="/logo.png" alt="STUDIO" />
            </Link>
          </div>
          {/* Clientes large view */}
          <div className="hidden p-2 lg:block">
            {accounts.map((account) => (
              <div key={account.id}>
                <Link
                  to={`/dashboard/${account.slug}/${searchParams}`}
                  className="block overflow-hidden text-ellipsis whitespace-nowrap rounded p-2 text-xs font-normal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand dark:hover:bg-gray-800"
                >
                  {account.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="header-menu lg:flex lg:w-full lg:flex-col lg:p-2">
          <div className="lg:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="header-menu-link">
                  <BriefcaseIcon />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content">
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

          <div className="lg:p-2">
            <SearchBox />
          </div>

          <div>
            <DropdownMenu.Root>
              <FocusRing focusClass="ring-2 ring-brand">
                <DropdownMenu.Trigger className="flex items-center gap-2 rounded p-2 outline-none lg:w-full">
                  <div className="text-xs font-semibold">{person.name}</div>

                  <UserIcon className="ml-auto w-4" />
                </DropdownMenu.Trigger>
              </FocusRing>

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
        </div>
      </div>

      {/* Content */}
      <div className="flex-auto">{children}</div>

      <>
        {/* Dialog for Celebration */}
        <Dialog.Root
          open={context.celebrations.openDialogCelebration}
          onOpenChange={context.celebrations.setOpenDialogCelebration}
        >
          <AnimatePresence>
            {context.celebrations.openDialogCelebration && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased lg:max-h-[80vh]"
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
          open={context.actions.openDialogAction}
          onOpenChange={context.actions.setOpenDialogAction}
        >
          <AnimatePresence>
            {context.actions.openDialogAction && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased lg:max-h-[80vh]"
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
          open={context.campaigns.openDialogCampaign}
          onOpenChange={context.campaigns.setOpenDialogCampaign}
        >
          <AnimatePresence>
            {context.campaigns.openDialogCampaign && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased lg:max-h-[80vh]"
                    {...scaleUp()}
                  >
                    <CampaignDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
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
