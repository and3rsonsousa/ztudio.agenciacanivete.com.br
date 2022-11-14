import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getActions, handleAction } from "~/lib/data";
export const loader: LoaderFunction = async ({ request, params }) => {
  let period = new URL(request.url).searchParams.get("period");

  const { data: actions } = await getActions({
    request,
    account: params.slug,
    period,
  });
  return { actions };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

export default function SlugIndex() {
  const { actions } = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <>
      {/* <pre>{JSON.stringify(actions, undefined, 2)}</pre> */}
      <Calendar
        actions={actions}
        grid={searchParams.get("instagram") !== null}
      />
    </>
  );
}
