import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { ActionMedium } from "~/components/Actions";
import CalendarHeader from "~/components/CalendarHeader";
import Exclamation from "~/components/Exclamation";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import type { ActionModel } from "~/lib/models";

export async function loader({ params, request }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  let { date } = params;
  let oldDate = new URL(request.url).searchParams.get("oldDate");

  let day = dayjs();

  if (date !== "today") {
    const pattern = /^\d{1,2}-\d{1,2}-\d{4}$/;

    if (date?.match(pattern)) {
      let dateInfo = date.split("-");
      day = dayjs(`${dateInfo[2]}-${dateInfo[1]}-${dateInfo[0]}`);
    } else {
      throw redirect(`/dashboard/day/today?oldDate=${date}`);
    }

    if (!day.isValid()) {
      throw redirect(`/dashboard/day/today?oldDate=${date}`);
    }
  }

  date = day.format("YYYY-MM-DD");

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.account,
      user: session?.user.id,
      period: date,
      mode: "day",
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { date, oldDate, actions, campaigns };
}

export default function DayPage() {
  const { date, actions, oldDate } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <div>
          <CalendarHeader date={dayjs(date)} view="day" />
        </div>

        {oldDate && (
          <div className="flex max-w-xs items-center gap-2">
            <Exclamation icon size="small" type="alert">
              <strong>{oldDate}</strong> não é uma data válida. Por isso você
              foi redirecionado para o dia de hoje.
            </Exclamation>
          </div>
        )}
      </div>
      <div className="p-2">
        {Array(24)
          .fill(0)
          .map((h, index) => {
            const currentActions: ActionModel[] | undefined = actions?.filter(
              (action) => dayjs(action.date).format("H") === index.toString()
            );
            return (
              currentActions &&
              currentActions.length > 0 && (
                <div
                  key={index}
                  className="flex gap-2 border-b p-2 dark:border-gray-800"
                >
                  <div className="text-xl font-medium">{index}h</div>
                  <div className="grid grid-cols-3 gap-x-2">
                    {currentActions.map((action) => (
                      <div key={action.id}>
                        <ActionMedium action={action} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}
