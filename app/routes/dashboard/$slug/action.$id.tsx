import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import ActionList from "~/components/ActionList";
import AddActionDialog from "~/components/Dialogs/ActionDialog";
import Exclamation from "~/components/Exclamation";
import { getAction, getActions, getCampaigns, handleAction } from "~/lib/data";
import { actionsByPriority } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { error } = await handleAction(formData, request);
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  if (error) return { error };
  return redirect(redirectTo ?? `/dashboard/${params.slug}`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [{ data: action }, { data: actions }, { data: campaigns }] =
    await Promise.all([
      getAction(request, params.id as string),
      getActions({ request, account: params.slug }),
      getCampaigns({ request, account: params.slug }),
    ]);

  return { action, actions, campaigns };
};

export default function ActionPage() {
  const { action, actions } = useLoaderData<{
    action: ActionModel;
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
          <ActionList
            // actions={actionsByPriority(actions)}
            actions={actions}
            hideAccount
            showDateAndTime
          />
        </div>
      </div>
    </div>
  );
}
