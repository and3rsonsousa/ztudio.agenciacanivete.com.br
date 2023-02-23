import type { LoaderArgs } from "@remix-run/cloudflare";
import dayjs from "dayjs";
import { useLoaderData } from "@remix-run/react";
import CalendarYear from "~/components/CalendarYear";
import { getMonth, getYear } from "~/lib/functions";
import CalendarHeader from "~/components/CalendarHeader";

export function loader({ request, params }: LoaderArgs) {
  let { date } = params;

  let oldDate = new URL(request.url).searchParams.get("oldDate");

  const pattern = /^\d{1,2}-\d{1,2}-\d{4}$/;
  let day = dayjs();
  if (date?.match(pattern)) {
    let dateInfo = date.split("-");
    day = dayjs(`${dateInfo[2]}-${dateInfo[1]}-${dateInfo[0]}`);
  }

  date = day.format("YYYY-MM-DD");

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
