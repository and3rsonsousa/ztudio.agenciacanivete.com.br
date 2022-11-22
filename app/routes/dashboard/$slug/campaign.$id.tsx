import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import {
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import ActionList from "~/components/ActionList";
import CampaignDialog from "~/components/Dialogs/CampaignDialog";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import { getCampaign, handleAction } from "~/lib/data";
import type { CampaignModel } from "~/lib/models";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { error } = await handleAction(formData, request);
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  if (!error) {
    return redirect(redirectTo ?? `/dashboard/${params.slug}`);
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data, error } = await getCampaign(request, params.id as string);
  return { campaign: data, error };
};

export default function CampaignsPage() {
  const { campaign } = useLoaderData<{ campaign: CampaignModel }>();
  const actionData = useActionData();
  const context: {
    actions: { setOpenDialogAction: (b: boolean) => void };
  } = useOutletContext();

  return (
    <div className="h-full overflow-hidden p-4 lg:p-8">
      <div className="mx-auto h-full max-w-4xl grid-cols-3 overflow-hidden lg:grid">
        <div className="no-scrollbars col-span-2 h-full overflow-hidden overflow-y-auto px-4">
          {actionData && (
            <Exclamation type="error">{actionData.error.message}</Exclamation>
          )}
          <CampaignDialog campaign={campaign} />
        </div>
        <div className="col-span-1 flex h-full flex-col justify-between overflow-hidden ">
          <div className="flex-auto">
            <h4 className="px-4">Ações da campanha</h4>
            <div className="no-scrollbars  overflow-hidden overflow-y-auto p-4">
              <ActionList actions={[]} hideAccount showDateAndTime />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              small
              primary
              onClick={() => {
                context.actions.setOpenDialogAction(true);
              }}
            >
              <div>Nova Ação</div>
              <DocumentPlusIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}