import { Outlet, useOutletContext } from "@remix-run/react";

export default function TrashPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
        <h2 className="mb-0 overflow-hidden text-ellipsis whitespace-nowrap  dark:text-gray-200">
          Lixeira
        </h2>
      </div>

      <Outlet context={useOutletContext()} />
    </div>
  );
}
