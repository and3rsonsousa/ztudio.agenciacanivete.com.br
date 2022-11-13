import type { LoaderFunction } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionMedium } from "~/components/Actions";
import CampaignDialog from "~/components/Dialogs/CampaignDialog";
import Exclamation from "~/components/Exclamation";
import { getCampaign } from "~/lib/data";
import type { CampaignModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data, error } = await getCampaign(request, params.id as string);
  return { campaign: data, error };
};

export default function CampaignsPage() {
  const { campaign } = useLoaderData<{ campaign: CampaignModel }>();
  const actionData = useActionData();
  return (
    <div className="overflow-hidden p-4 lg:p-8">
      <div className="mx-auto h-full max-w-4xl grid-cols-3 overflow-hidden lg:grid">
        <div className="no-scrollbars col-span-2 h-full overflow-hidden overflow-y-auto px-4">
          {actionData && (
            <Exclamation type="error">{actionData.error.message}</Exclamation>
          )}
          <CampaignDialog campaign={campaign} />
        </div>
        <div className="col-span-1 h-full overflow-hidden ">
          <h4 className="px-4">Ações da campanha</h4>
          <div className="no-scrollbars h-full overflow-hidden overflow-y-auto p-4">
            {campaign.actions &&
              campaign.actions.map((action) => (
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
