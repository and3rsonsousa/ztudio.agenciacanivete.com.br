import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";

export const loader: LoaderFunction = async ({ request, params }) => {
  let period = new URL(request.url).searchParams.get("month");
  const {
    data: { session },
    response,
  } = await getUser(request);

  if (session === null) {
    throw redirect(`/login`, { headers: response.headers });
  }

  //   const [{ data: actions }, { data: campaigns }] = await Promise.all([
  //     getActions({
  //       request,
  //       account: params.account,
  //       user: session?.user.id,
  //       period,
  //     }),
  //     getCampaigns({ request, user: session?.user.id }),
  //   ]);

  //   return { actions, campaigns };
  return {};
};

const DashboardIndex = () => {
  // const { actions, campaigns } = useLoaderData();

  return (
    <div className="h-screen">
      {/* <Calendar actions={actions} campaigns={campaigns} /> */}
    </div>
  );
};

export default DashboardIndex;
