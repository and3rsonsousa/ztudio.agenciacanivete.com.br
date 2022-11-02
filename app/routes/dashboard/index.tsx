import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);
  const { data: actions } = await getActions({
    request,
    user: data.session.user.id,
  });

  return { actions };
};

const DashboardIndex = () => {
  const { actions } = useLoaderData();
  return (
    <div>
      <Calendar actions={actions} />
    </div>
  );
};

export default DashboardIndex;
