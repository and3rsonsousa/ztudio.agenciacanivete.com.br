import type { LoaderArgs } from "@remix-run/cloudflare";
import dayjs from "dayjs";
import { useLoaderData } from "@remix-run/react";
import CalendarYear from "~/components/CalendarYear";
import { getMonth, getYear } from "~/lib/functions";
import CalendarHeader from "~/components/CalendarHeader";

export function loader({ request, params }: LoaderArgs) {
  const { date } = params;

  return { date: date ?? dayjs().format("YYYY-MM") };
}

export default function YearPage() {
  const { date } = useLoaderData<typeof loader>();
  const { firstDayOfCurrentMonth } = getMonth({
    period: date,
  });

  const { year } = getYear(firstDayOfCurrentMonth);
  return (
    <div>
      <CalendarHeader date={firstDayOfCurrentMonth} view="year" />
      <CalendarYear year={year} />
    </div>
  );
}
