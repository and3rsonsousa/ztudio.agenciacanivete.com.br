import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionMedium } from "~/components/Actions";
import AddActionDialog from "~/components/Dialogs/ActionDialog";
import Exclamation from "~/components/Exclamation";
import { getAction, getActions, handleAction } from "~/lib/data";
import type { ActionModel, ActionModelFull } from "~/lib/models";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { error } = await handleAction(formData, request);

  if (!error) {
    return redirect(`/dashboard/${params.slug}`);
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [{ data: action }, { data: actions }] = await Promise.all([
    getAction(request, params.id as string),
    getActions({ request, account: params.slug }),
  ]);

  return { action, actions };
};

export default function ActionPage() {
  const { action, actions } = useLoaderData<{
    action: ActionModelFull;
    actions: ActionModel[];
  }>();
  const actionData = useActionData<{ error: { message: string } }>();

  return (
    <div className="overflow-hidden p-4 lg:p-8">
      <div className="mx-auto h-full max-w-4xl grid-cols-3 overflow-hidden lg:grid">
        <div className="no-scrollbars col-span-2 h-full overflow-hidden overflow-y-auto px-4">
          {actionData && (
            <Exclamation type="error">{actionData.error.message}</Exclamation>
          )}
          <AddActionDialog action={action} />
        </div>
        <div className="col-span-1 h-full overflow-hidden ">
          <h4 className="px-4">Ações recentes</h4>
          <div className="no-scrollbars h-full overflow-hidden overflow-y-auto p-4">
            {actions.map((action) => (
              <ActionMedium
                action={action}
                key={action.id}
                showDateAndTime
                hideAccount
              />
            ))}
            <div className="h-4"> </div>
          </div>
        </div>
      </div>
    </div>
  );
}
