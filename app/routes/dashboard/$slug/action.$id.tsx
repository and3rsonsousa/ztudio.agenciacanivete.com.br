import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import AddActionDialog from "~/components/AddActionDialog";
import Exclamation from "~/components/Exclamation";
import { getAction, handleAction } from "~/lib/data";
import type { ActionModelFull } from "~/lib/models";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { error } = await handleAction(formData, request);

  if (!error) {
    return redirect(`/dashboard/${params.slug}`);
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: action } = await getAction(request, params.id as string);
  return { action };
};

export default function ActionPage() {
  const { action } = useLoaderData<{ action: ActionModelFull }>();
  const actionData = useActionData<{ error: { message: string } }>();

  return (
    <div className="h-full overflow-hidden overflow-y-auto  p-4 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {actionData && (
          <Exclamation type="error">{actionData.error.message}</Exclamation>
        )}
        <AddActionDialog action={action} />
      </div>
    </div>
  );
}
