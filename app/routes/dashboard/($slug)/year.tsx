import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/CalendarHeader";
import CalendarYear from "~/components/Views/CalendarYear";
import Scrollable from "~/components/Scrollable";
import { checkDate, getYear } from "~/lib/functions";

export function loader({ request }: LoaderArgs) {
  let date = new URL(request.url).searchParams.get("date");
  date = checkDate(date);
  return { date };
}

export default function YearPage() {
  const { date } = useLoaderData<typeof loader>();

  const period = dayjs(date);
  const { year } = getYear(period);

  return (
    <>
      <div>
        <CalendarHeader date={period} view="year" />
      </div>
      <Scrollable>
        <CalendarYear year={year} />
      </Scrollable>
    </>
  );
}
