import { useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { ActionModel, ItemModel } from "~/lib/models";

const DataFlow = ({ actions }: { actions: ActionModel[] }) => {
  const matches = useMatches();
  const status: ItemModel[] = matches[1].data.status;
  const stats = status.map((stat) => ({
    stat,
    actions: actions.filter((action) => action.status.slug === stat.slug)
      .length,
  }));

  const total = actions.length;
  const accomplished = actions.filter(
    (action) => action.status.slug === "accomplished"
  ).length;
  const late = actions.filter(
    (action) =>
      dayjs(action.date).isBefore(dayjs()) &&
      action.status.slug !== "accomplished"
  ).length;
  return (
    <div className="flex">
      <div className="px-2 text-center md:px-4">
        <div className="font-medium">{total}</div>
        <div className="text-[8px] font-bold uppercase tracking-[1px]">
          Ações
        </div>
        <div className="mt-1 flex h-1 w-12 overflow-hidden rounded-sm bg-gray-700">
          {stats.reverse().map((status) => (
            <div
              key={status.stat.id}
              className={`bg-${status.stat.slug} h-1 flex-auto`}
              style={{
                width: `${Math.floor((status.actions / total) * 100)}%`,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div
        className={`px-2 text-center ${
          accomplished > total / 0.1
            ? "text-success-500"
            : accomplished > total / 3
            ? "text-alert-500"
            : "text-error-500"
        } md:px-4`}
      >
        <div className="font-medium">
          {Math.floor((accomplished / total) * 100)}%
        </div>
        <div className="text-[8px] font-bold uppercase tracking-[1px]">
          concluídos
        </div>
      </div>
      {late > 0 ? (
        <div className={`px-2 text-center text-error-500 md:px-4`}>
          <div className="font-medium ">{late}</div>
          <div className="text-[8px] font-bold uppercase tracking-[1px]">
            atrasadas
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default DataFlow;
