import {
  Form,
  useActionData,
  useMatches,
  useOutletContext,
  useTransition,
} from "@remix-run/react";
import { add, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { AccountModel, CampaignModel, PersonModel } from "~/lib/models";
import Exclamation from "../Exclamation";
import Button from "../Forms/Button";
import InputField from "../Forms/InputField";
import Field from "../Forms/InputField";
import SelectField from "../Forms/SelectField";

export default function CampaignDialog({
  date,
  campaign,
}: {
  date: Date;
  campaign?: CampaignModel;
}) {
  const actionData = useActionData();
  const transition = useTransition();
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
    transition.state === "submitting" &&
    transition.submission.formData.get("action") === "create-celebration";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <>
      <h4 className="mb-4">Nova Campanha</h4>
      {actionData && actionData.error ? (
        <Exclamation type="error" icon>
          {actionData.error.message}
        </Exclamation>
      ) : null}

      <Form
        method="post"
        ref={formRef}
        onSubmit={() => {
          if (context) {
            context.campaigns?.setOpenDialogCampaign(false);
          }
        }}
      >
        <input type="hidden" name="action" value="create-campaign" />

        {campaign ? (
          <input type="hidden" name="id" value={campaign.id} />
        ) : (
          <input type="hidden" name="creator" value={creator.id} />
        )}
        <Field name="name" title="Nome" />
        <InputField
          name="date_start"
          title="Começa em"
          type="datetime-local"
          value={format(
            campaign ? new Date(campaign.date_start) : date ?? new Date(),
            "y-MM-dd 00:00"
          )}
          placeholder="dd/mm"
        />
        <InputField
          name="date_end"
          title="Termina em"
          type="datetime-local"
          value={format(
            campaign
              ? new Date(campaign.date_end)
              : add(date, { days: 7 }) ?? new Date(),
            "y-MM-dd 23:59"
          )}
          placeholder="dd/mm"
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

        <div className="flex items-center justify-end pt-4">
          <Button primary small type="submit">
            Adicionar
          </Button>
        </div>
      </Form>
    </>
  );
}
