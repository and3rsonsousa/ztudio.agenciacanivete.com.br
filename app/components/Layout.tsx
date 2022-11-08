import { LockClosedIcon } from "@heroicons/react/20/solid";
import {
  BriefcaseIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useMatches, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { AccountModel, PersonModel } from "~/lib/models";
import SearchBox from "./SearchBox";

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
      <div className="no-scrollbars flex flex-shrink-0 items-center justify-between border-b dark:border-gray-800 lg:flex lg:w-48 lg:flex-col lg:overflow-hidden lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-4">
        <div className="lg:w-full">
          {/* Logo */}
          <div className="-mt-1 w-36 p-4 lg:pt-0">
            <Link
              to={`/dashboard`}
              className="focus-block -mt2 -ml-2 block rounded border border-transparent p-2 transition"
            >
              <img src="/logo.png" alt="STUDIO" />
            </Link>
          </div>
          {/* Clientes large view */}
          <div className="hidden p-2 lg:block">
            {accounts.map((account) => (
              <div key={account.id}>
                <Link
                  to={`/dashboard/${account.slug}`}
                  className="focus-block block overflow-hidden text-ellipsis whitespace-nowrap rounded border border-transparent p-2 text-xs font-normal transition hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
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
            <SearchBox />
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
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/dashboard/me"
                      className="dropdown-item item-small block"
                    >
                      Meus dados
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="dropdown-item item-small"
                    onSelect={() => navigate("/signout")}
                  >
                    Sair
                  </DropdownMenu.Item>
                  {person.admin && (
                    <>
                      <hr className="my-2 dark:border-gray-800" />
                      <DropdownMenu.Label className="dropdown-label flex items-center gap-1">
                        <LockClosedIcon className="w-3" />
                        <div>clientes</div>
                      </DropdownMenu.Label>
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
                      <hr className="my-2 dark:border-gray-800" />
                      <DropdownMenu.Label className="dropdown-label flex items-center gap-1">
                        <LockClosedIcon className="w-3" />
                        <div>usuários</div>
                      </DropdownMenu.Label>
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
    </div>
  );
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  return (
    <DropdownMenu.Item
      className="dropdown-item item-small flex items-center gap-2"
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
