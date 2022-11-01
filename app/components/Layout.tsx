import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useMatches, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { AccountModel, PersonModel } from "~/lib/models";

export default function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const person: PersonModel = matches[1].data.person;
  const accounts: AccountModel[] = matches[1].data.accounts;
  // const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let theme;
    if (localStorage) {
      theme = localStorage.getItem("theme");
    }
    if (theme) {
      document.body.classList.add(theme);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col  lg:flex-row">
      {/* Header */}
      <div className="no-scrollbars flex items-center justify-between border-b dark:border-gray-800 lg:flex lg:w-48 lg:flex-col lg:overflow-hidden lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-4">
        <div className="lg:w-full">
          {/* Logo */}
          <div className="w-32 p-4">
            <img src="/logo.png" alt="STUDIO" />
          </div>
          {/* Clientes large view */}
          <div className="hidden p-2 lg:block">
            {accounts.map((account) => (
              <div key={account.id}>
                <Link
                  to={`/dashboard/${account.slug}`}
                  className="focus-block block overflow-hidden text-ellipsis whitespace-nowrap rounded border border-transparent p-2 text-xs font-normal hover:bg-gray-100 focus:outline-none"
                >
                  {account.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="header-menu lg:flex lg:w-full lg:flex-col lg:p-2">
          <div className="lg:hidden">
            <Link to="#" className="header-menu-link">
              <BriefcaseIcon />
            </Link>
          </div>
          <div className="lg:p-2">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  onClick={() => {}}
                  className="header-menu-link flex w-full cursor-text items-center justify-between gap-2 rounded lg:bg-gray-100"
                >
                  <div className="hidden text-sm lg:block">Pesquisar</div>
                  <div>
                    <MagnifyingGlassIcon />
                  </div>
                </button>
              </Dialog.Trigger>
              <Dialog.Overlay className="dialog-overlay">
                <Dialog.Content className="dialog-content w-72 overflow-hidden border border-black/5 sm:w-96 lg:w-[36rem]">
                  ok
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Root>
          </div>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="header-menu-link items-center gap-2 lg:w-full lg:justify-between">
                <div className="text-xs font-semibold">{person.name}</div>
                <div>
                  <UserIcon />
                </div>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content mr-4" loop>
                  <div className="flex items-center justify-between gap-2">
                    <ThemeSwitcher />
                  </div>

                  <hr className="my-2 dark:border-gray-800" />
                  <DropdownMenu.Label className="dropdown-label">
                    minha conta
                  </DropdownMenu.Label>
                  <DropdownMenu.Item className="dropdown-item">
                    Meus dados
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="dropdown-item"
                    onSelect={() => navigate("/signout")}
                  >
                    Sair
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-auto">{children}</div>
    </div>
  );
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  return (
    <DropdownMenu.Item
      className="dropdown-item flex items-center gap-2"
      onSelect={() => {
        if (theme === "dark") {
          document.body.classList.remove("dark");
          localStorage.removeItem("theme");
          setTheme("");
        } else {
          document.body.classList.add("dark");
          localStorage.setItem("theme", "dark");
          setTheme("dark");
        }
      }}
    >
      <div>Modo {theme === "dark" ? "claro" : "escuro"}</div>

      {theme === "dark" ? (
        <SunIcon className="w-4" />
      ) : (
        <MoonIcon className="w-4" />
      )}
    </DropdownMenu.Item>
  );
}
