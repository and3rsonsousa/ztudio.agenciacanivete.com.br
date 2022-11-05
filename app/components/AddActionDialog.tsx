import { Form, useMatches, useTransition } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { AccountModel, CampaignModel, PersonModel } from "~/lib/models";
import Button from "./Forms/Button";
import { default as Field, default as InputField } from "./Forms/InputField";
import SelectField from "./Forms/SelectField";
import TextareaField from "./Forms/TextareaField";

export default function AddActionDialog({ date }: { date: Date }) {
  const matches = useMatches();
  const creator: PersonModel = matches[1].data.person;
  const accounts: AccountModel[] = matches[1].data.accounts;
  const campaigns: CampaignModel[] = matches[1].data.campaigns;
  const tags: CampaignModel[] = matches[1].data.tags;
  const status: CampaignModel[] = matches[1].data.status;
  const account: AccountModel = matches[2].data.account;
  const persons: PersonModel[] = matches[1].data.persons;

  const accountItems = accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }));

  const personsItems = persons.map((person) => ({
    title: person.name,
    value: person.id,
  }));

  const [selectedAccount, setSelectedAccount] = useState(
    account ? account.id : ""
  );
  const campaignItems = selectedAccount
    ? campaigns
        .filter((campaign) => campaign.account === selectedAccount)
        .map((campaign) => ({
          title: campaign.name,
          value: campaign.id,
        }))
    : undefined;

  const transition = useTransition();
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("action") === "create-action";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);
  return (
    <>
      <h4 className="mb-4">Nova Ação</h4>
      <Form method="post" ref={formRef}>
        <input type="hidden" name="action" value="create-action" />
        <input type="hidden" name="creator" value={creator.id} />

        <Field name="name" title="Nome" />
        <SelectField
          name="account"
          title="Cliente"
          value={account ? account.id : undefined}
          items={accountItems}
          onChange={setSelectedAccount}
        />
        <SelectField
          name="campaign"
          title="Campanha"
          items={campaignItems}
          placeholder={
            campaignItems && selectedAccount
              ? campaignItems?.length > 0
                ? "Selecione uma campanha"
                : "Nenhum campanha para esse cliente"
              : "Escolha um cliente primeiro"
          }
          disabled={campaignItems?.length === 0 && selectedAccount !== ""}
        />
        <TextareaField name="description" title="Descrição" />

        <div className="grid w-full grid-cols-2 gap-4">
          <SelectField
            name="tag"
            title="Tags"
            value="d90224a7-abf2-4bc7-be60-e5d165a6a37a"
            items={tags.map((tag) => ({ title: tag.name, value: tag.id }))}
          />

          <SelectField
            name="status"
            title="Status"
            value="32a26e75-5f4a-4ae7-8805-877909abb477"
            items={status.map((stat) => ({
              title: stat.name,
              value: stat.id,
            }))}
          />

          <InputField
            name="date"
            title="Data"
            type="datetime-local"
            value={format(date, "y-MM-dd 11:12")}
          />

          <SelectField
            name="responsible"
            title="Responsável"
            items={personsItems}
            value={creator.id}
          />
        </div>

        <div className="flex items-center justify-end pt-4">
          {/* <Checkbox
            name="close"
            title="Manter aberta"
            checked={keepOpened}
            onChange={() => setKeepOpened(!keepOpened)}
          /> */}
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </Form>
    </>
  );
}
