import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/CalendarHeader";
import WeekView from "~/components/CalendarWeek";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import { checkDate, getWeek } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export async function loader({ request, params }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  let date = new URL(request.url).searchParams.get("date");
  let period = checkDate(date);

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.slug,
      user: session?.user.id,
      period: period,
      mode: "week",
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { period, actions, campaigns };
}

export default function WeekPage() {
  const { period, actions } = useLoaderData<typeof loader>();
  const { days } = getWeek({
    period,
  });

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex justify-between">
        <div>
          <CalendarHeader date={dayjs(period)} view="week" />
        </div>
      </div>
      <WeekView period={days} actions={actions as ActionModel[]} />
    </div>
  );
}
