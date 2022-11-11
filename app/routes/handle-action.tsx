import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { handleAction } from "~/lib/data";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  await handleAction(formData, request);
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");

  if (redirectTo !== undefined && redirectTo !== null) {
    return redirect(redirectTo);
  }

  return {};
};

export const loader: LoaderFunction = async ({ request }) => {
  return {};
};
