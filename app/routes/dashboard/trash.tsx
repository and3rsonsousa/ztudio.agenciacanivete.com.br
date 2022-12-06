import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Actions } from "~/components/Actions";
import { getActions } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getActions({
    request,
    all: true,
    where: "trash",
  });

  return {
    actions: data,
  };
};

export default function TrashPage() {
  const { actions } = useLoaderData();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
        <h2 className="mb-0 overflow-hidden text-ellipsis whitespace-nowrap  dark:text-gray-200">
          Lixeira
        </h2>
      </div>

      <div className="no-scrollbars flex-auto overflow-hidden overflow-y-auto">
        <div className="p-4">
          {/* {JSON.stringify(actions, undefined, 2)} */}
          <Actions actions={actions} />
        </div>
      </div>
    </div>
  );
}
