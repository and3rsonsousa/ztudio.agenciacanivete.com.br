import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { ActionMedium } from "~/components/Actions";
import { getActions } from "~/lib/data";
import type { ActionModel } from "~/lib/models";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data } = await getActions({
    request,
    all: true,
    account: params.slug,
  });

  return { actions: data };
};

export default function Actions() {
  const { actions } = useLoaderData<{ actions: ActionModel[] }>();
  let currentMonth = "";
  return (
    <div className="no-scrollbars grid gap-x-4 gap-y-2 overflow-hidden overflow-y-auto p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
      {actions.reverse().map((action) => {
        const header =
          currentMonth !== dayjs(action.date).format("MM") ? (
            <h4 className="col-span-full py-4 first-letter:capitalize">
              {dayjs(action.date).format("MMMM [de] YYYY")}
            </h4>
          ) : null;
        currentMonth = dayjs(action.date).format("MM");
        return (
          <>
            {header}
            <ActionMedium
              key={action.id}
              action={action}
              hideAccount={true}
              showDateAndTime={true}
            />
          </>
        );
      })}
    </div>
  );
}
