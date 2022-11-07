import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import AddActionDialog from "~/components/AddActionDialog";
import { getAction, handleAction } from "~/lib/data";
import type { ActionModelFull } from "~/lib/models";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: action } = await getAction(request, params.action as string);

  return { action };
};

export default function ActionPage() {
  const { action } = useLoaderData<{ action: ActionModelFull }>();
  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <AddActionDialog action={action} />
        <pre>{JSON.stringify(action, undefined, 2)}</pre>
      </div>
    </div>
  );
}
