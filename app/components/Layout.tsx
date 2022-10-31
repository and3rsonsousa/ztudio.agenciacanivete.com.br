import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Form, Link } from "@remix-run/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let theme;
    if (localStorage) {
      theme = localStorage.getItem("theme");
    }
    if (theme) {
      document.body.classList.add(theme);
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <div className="border-b dark:border-gray-800">
        <div className="container mx-auto flex  items-center justify-between">
          <div className="w-32 p-4">
            <img src="/logo.png" alt="STUDIO" />
          </div>
          <div className="header-menu">
            <div>
              <Link to="#" className="header-menu-link">
                <BriefcaseIcon />
              </Link>
            </div>
            <div>
              <Link to="#" className="header-menu-link">
                <MagnifyingGlassIcon />
              </Link>
            </div>
            <div>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="header-menu-link">
                  <UserIcon />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="dropdown-content" loop>
                    <DropdownMenu.Label className="dropdown-label">
                      Label do conteúdo
                    </DropdownMenu.Label>
                    <DropdownMenu.Item className="dropdown-item">
                      Aqui foi
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="dropdown-item">
                      Aqui também
                    </DropdownMenu.Item>
                    <hr className="my-2" />
                    <DropdownMenu.Label className="dropdown-label">
                      minha conta
                    </DropdownMenu.Label>
                    <DropdownMenu.Item className="dropdown-item">
                      Meus dados
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-item">
                      <Link to={`/signout`}>Sair</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto flex-auto">{children}</div>

      {/* Footer */}
      <div className="text-xx border-t p-2 text-center font-bold tracking-wide text-gray-400 dark:border-gray-800">
        @CNVT
      </div>
    </div>
  );
}
