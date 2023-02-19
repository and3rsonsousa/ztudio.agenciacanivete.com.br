import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import Exclamation from "~/components/Exclamation";
import PageHeader from "~/components/PageHeader";

export async function loader({ params, request }: LoaderArgs) {
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

  return { date, day, oldDate };
}

export default function DayPage() {
  const { date, day, oldDate } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <PageHeader link={`/dashboard/day/${date}`}>
            {dayjs(day).format("DD [de] MMMM [de] YYYY")}
            {date === "today" && " (Hoje)"}
          </PageHeader>
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
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque minima
        eveniet asperiores doloribus illum consequuntur necessitatibus suscipit
        officiis beatae amet? Voluptatum quasi, culpa adipisci hic cumque harum
        illum numquam amet!
      </div>
    </div>
  );
}
