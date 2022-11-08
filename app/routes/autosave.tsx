import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { handleAction } from "~/lib/data";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  await handleAction(formData, request);

  return {};
};

export const loader: LoaderFunction = async ({ request }) => {
  return {};
};
