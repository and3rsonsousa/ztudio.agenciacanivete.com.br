import { StarIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import type { CelebrationModel } from "~/lib/models";

const Celebration = ({
  celebration,
  small,
}: {
  celebration: CelebrationModel;
  small?: boolean;
}) => {
  const fetcher = useFetcher();
  return (
    <div
      className={`group flex w-full items-center justify-between  ${
        small ? "text-xx my-0.5" : "my-1 text-xs"
      } font-normal`}
      title={celebration.name}
    >
      <div className="flex flex-auto items-center gap-1 overflow-hidden">
        {celebration.is_holiday ? (
          <StarIcon className="w-3 text-gray-400" />
        ) : null}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {celebration.name}
        </div>
      </div>
      <div className="text-gray-400 opacity-0 transition hover:text-gray-700 group-hover:opacity-100">
        <fetcher.Form method="post" action="/handle-action">
          <input type="hidden" name="action" value="delete-celebration" />
          <input type="hidden" name="id" value={celebration.id} />
          <button type="submit" className="appearance-none align-middle">
            <TrashIcon className="w-3" />
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default Celebration;
