import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/CalendarHeader";
import WeekView from "~/components/CalendarWeek";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import { getWeek } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export async function loader({ request, params }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  let { date } = params;
  let oldDate = new URL(request.url).searchParams.get("oldDate");

  const pattern = /^\d{1,2}-\d{1,2}-\d{4}$/;
  let day = dayjs();
  if (date?.match(pattern)) {
    let dateInfo = date.split("-");
    day = dayjs(`${dateInfo[2]}-${dateInfo[1]}-${dateInfo[0]}`);
  } else {
    throw redirect(
      `/dashboard/week/${dayjs().format("DD-MM-YYYY")}?oldDate=${date}`
    );
  }

  if (!day.isValid()) {
    throw redirect(
      `/dashboard/week/${dayjs().format("DD-MM-YYYY")}?oldDate=${date}`
    );
  }

  date = day.format("YYYY-MM-DD");

  const period = date ?? dayjs().format("YYYY-MM-DD");

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.account,
      user: session?.user.id,
      period: period,
      mode: "week",
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { period, actions, campaigns, oldDate };
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
