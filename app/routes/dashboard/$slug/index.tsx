import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getActions, getCampaigns, handleAction } from "~/lib/data";
export const loader: LoaderFunction = async ({ request, params }) => {
  let period = new URL(request.url).searchParams.get("period");

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
  const [searchParams] = useSearchParams();

  return (
    <>
      {/* <pre>{JSON.stringify(actions, undefined, 2)}</pre> */}
      <Calendar
        actions={actions}
        campaigns={campaigns}
        grid={searchParams.get("instagram") !== null}
      />
    </>
  );
}
