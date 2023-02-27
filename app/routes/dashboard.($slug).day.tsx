import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { ActionMedium } from "~/components/Actions";
import CalendarHeader from "~/components/CalendarHeader";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import type { ActionModel } from "~/lib/models";

import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { checkDate } from "~/lib/functions";
import Exclamation from "~/components/Exclamation";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export async function loader({ params, request }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  let date = checkDate(new URL(request.url).searchParams.get("date"));

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.slug,
      user: session?.user.id,
      period: date,
      mode: "day",
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { date, actions, campaigns };
}

export default function DayPage() {
  const { date, actions } = useLoaderData<typeof loader>();
  let isEmpty = 0;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <div>
          <CalendarHeader date={dayjs(date)} view="day" />
        </div>
      </div>
      <div className="p-2">
        {Array(24)
          .fill(0)
          .map((h, index) => {
            const currentActions: ActionModel[] | undefined = actions?.filter(
              (action) => dayjs(action.date).format("H") === index.toString()
            );

            if (currentActions && currentActions.length > 0) {
              isEmpty += 1;
            }

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
        {isEmpty === 0 && (
          <div>
            <Exclamation>Nenhuma ação nesse dia</Exclamation>
          </div>
        )}
      </div>
    </div>
  );
}
