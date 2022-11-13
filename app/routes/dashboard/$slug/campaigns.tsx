import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import Campaign from "~/components/Campaign";
import { getCampaigns } from "~/lib/data";
import type { CampaignModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data, error } = await getCampaigns({ request, account: params.slug });
  return { campaigns: data, error };
};

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<{ campaigns: CampaignModel[] }>();
  return (
    <div>
      <div className="flex items-center gap-2">
        <h4 className="mb-0 p-4 first-letter:capitalize">
          Campanhas de Marketing
        </h4>
      </div>

      <div className="p-4">
        {campaigns.map((campaign) => (
          <Campaign key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
