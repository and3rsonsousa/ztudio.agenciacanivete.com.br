import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import CalendarHeader from "~/components/CalendarHeader";
import CalendarYear from "~/components/CalendarYear";
import { checkDate, getMonth, getYear } from "~/lib/functions";

export function loader({ request }: LoaderArgs) {
  let date = new URL(request.url).searchParams.get("date");
  date = checkDate(date);
  return { date };
}

export default function YearPage() {
  const { date } = useLoaderData<typeof loader>();
  const { firstDayOfCurrentMonth } = getMonth({
    period: date,
  });

  const { year } = getYear(firstDayOfCurrentMonth);
  console.log(date, firstDayOfCurrentMonth.format("DD-MM-YYYY"));

  return (
    <div>
      <CalendarHeader date={firstDayOfCurrentMonth} view="year" />
      <CalendarYear year={year} />
    </div>
  );
}
