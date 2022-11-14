import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useFetcher, useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import type { CampaignModel } from "~/lib/models";

export default function Campaign({ campaign }: { campaign: CampaignModel }) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const account = matches[2].data.account;
  const url = matches[1].data.url;

  return (
    <div className="group flex justify-between gap-4">
      <div>
        <div className="text-lg font-semibold">{campaign.name}</div>
        <div className="mt-1 text-xs tracking-wide">
          {dayjs(campaign.date_start).isBefore(dayjs())
            ? "Começou no dia"
            : "Começa no dia"}
          <strong className="font-semibold">
            {dayjs(campaign.date_start).format(" D [de] MMMM [de] YYYY ")}
          </strong>
          {dayjs(campaign.date_end).isBefore(dayjs())
            ? "e terminou no dia"
            : "e terminará no dia"}

          <strong className="font-semibold">
            {dayjs(campaign.date_end).format(" D [de] MMMM [de] YYYY")}
          </strong>
        </div>
        <div className="mt-2 text-sm">
          {campaign.actions !== null ? "" : "Nenuma ação nessa campanha"}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
        <div>
          <Link
            to={`/dashboard/${account.slug}/campaign/${campaign.id}/?redirectTo=${url}`}
            className="button"
          >
            <PencilIcon />
          </Link>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              fetcher.submit(
                {
                  id: campaign.id,
                  action: "delete-campaign",
                },
                {
                  method: "post",
                  action: "/handle-action",
                }
              );
            }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
