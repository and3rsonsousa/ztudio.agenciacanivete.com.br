import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getActions, getCampaigns, handleAction } from "~/lib/data";

// export function meta({ data, matches }: { data: any; matches: any[] }) {
//   const root = matches.find((match) => match.route.id === "root");

//   const meta = root.meta;

//   console.log(matches);

//   return [
//     ...meta,
//     {
//       // title: `${data.account.name} - STUDIO`,
//     },
//   ];
// }

export const loader: LoaderFunction = async ({ request, params }) => {
  let period = new URL(request.url).searchParams.get("month");

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.slug,
      period,
    }),
    getCampaigns({ request, account: params.slug }),
  ]);
  return { actions, campaigns };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

export default function SlugIndex() {
  const { actions, campaigns } = useLoaderData();

  return (
    <>
      {/* <pre>{JSON.stringify(actions, undefined, 2)}</pre> */}
      <Calendar actions={actions} campaigns={campaigns} grid={true} />
    </>
  );
}
