import { useFetcher, useMatches, useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import type { AccountModel, CampaignModel, PersonModel } from "~/lib/models";
import Exclamation from "../Exclamation";
import Button from "../Forms/Button";
import DatepickerField from "../Forms/DatepickerField";
import { default as Field } from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import TextareaField from "../Forms/TextareaField";

export default function CampaignDialog({
  date,
  campaign,
}: {
  date: Dayjs;
  campaign?: CampaignModel;
}) {
  const fetcher = useFetcher();

  const matches = useMatches();
  const accounts: AccountModel[] = matches[1].data.accounts;
  const creator: PersonModel = matches[1].data.person;
  const account: AccountModel = campaign
    ? campaign.account
    : matches[2].data.account;

  const accountItems = accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }));

  const context: {
    campaigns: {
      setOpenDialogCampaign: any;
    };
  } = useOutletContext();
  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "create-celebration";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (
      !isAdding &&
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      context.campaigns?.setOpenDialogCampaign(false);
    }
  }, [isAdding, context, fetcher]);

  return (
    <>
      <div className="mb-4">
        <h4 className="m-0 dark:text-gray-200">
          {campaign ? `Editar Campanha` : `Nova Campanha`}
        </h4>
        {campaign ? (
          <div className="mt-1 text-xs font-normal text-gray-300 dark:text-gray-700">
            #{campaign.id}
          </div>
        ) : null}
      </div>
      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form method="post" ref={formRef} action="/handle-action">
        <input type="hidden" name="action" value="create-campaign" />

        {campaign ? (
          <input type="hidden" name="id" value={campaign.id} />
        ) : (
          <input type="hidden" name="creator" value={creator.id} />
        )}
        <Field
          name="name"
          title="Nome"
          value={campaign ? campaign.name : undefined}
        />
        {campaign ? (
          <input type="hidden" name="account" value={account.id} />
        ) : (
          <SelectField
            name="account"
            title="Cliente"
            value={account ? account.id : undefined}
            items={accountItems}
          />
        )}
        <TextareaField
          name="description"
          title="Descrição"
          lines={3}
          value={campaign ? campaign.description : undefined}
        />
        <div className="flex gap-4">
          <DatepickerField
            name="date_start"
            title="Começa em"
            date={campaign ? dayjs(campaign.date_start) : date}
          />
          <DatepickerField
            name="date_end"
            title="Termina em"
            date={campaign ? dayjs(campaign.date_end) : date.add(7, "days")}
          />
        </div>

        <div className="flex items-center justify-end pt-4">
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
