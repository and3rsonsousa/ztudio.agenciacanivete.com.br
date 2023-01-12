import {
  Form,
  useFetcher,
  useMatches,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import type {
  AccountModel,
  CampaignModel,
  ContextType,
  ItemModel,
  PersonModel,
} from "~/lib/models";
import Exclamation from "../Exclamation";
import Button from "../Button";
import DatepickerField from "../Forms/DatepickerField";
import { default as Field } from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import TextareaField from "../Forms/TextareaField";
import Loader from "../Loader";

export default function CampaignDialog({
  campaign,
}: {
  campaign?: CampaignModel;
}) {
  const fetcher = useFetcher();
  const matches = useMatches();
  const [searchParams] = useSearchParams();
  const context: ContextType = useOutletContext();
  const date = context.date.day;

  const accounts: AccountModel[] = matches[1].data.accounts;
  const status: ItemModel[] = matches[1].data.status;
  const creator: PersonModel = matches[1].data.person;
  const account: AccountModel = campaign
    ? campaign.account
    : matches[2].data.account;

  const accountItems = accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }));
  const statusItems = status.map((stat) => ({
    title: stat.name,
    value: stat.id,
  }));

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
      context.campaigns?.setOpen(false);
    }
  }, [isAdding, context, fetcher]);

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div>
          <h4 className="m-0 dark:text-gray-200">
            {campaign
              ? `Editar Campanha`
              : `Nova Campanha${account ? " para ".concat(account.name) : ""}`}
          </h4>
          {campaign ? (
            <div className="mt-1 text-xs font-normal text-gray-300 dark:text-gray-700">
              #{campaign.id}
            </div>
          ) : null}
        </div>
        <div>{isAdding && <Loader />}</div>
      </div>
      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form
        method="post"
        ref={formRef}
        action={
          campaign
            ? `./${
                searchParams.get("redirectTo") !== null
                  ? "?redirectTo=".concat(
                      searchParams.get("redirectTo") as string
                    )
                  : ""
              }`
            : "/handle-action"
        }
      >
        <input
          type="hidden"
          name="action"
          value={campaign ? "update-campaign" : "create-campaign"}
        />

        {campaign ? (
          <input type="hidden" name="id" value={campaign.id} />
        ) : (
          <input type="hidden" name="creator" value={creator.id} />
        )}
        <Field
          name="name"
          label="Nome"
          value={campaign ? campaign.name : undefined}
        />
        {campaign || account ? (
          <input type="hidden" name="account" value={account.id} />
        ) : (
          <SelectField name="account" title="Cliente" items={accountItems} />
        )}
        <TextareaField
          name="description"
          label="Descrição"
          rows={3}
          value={campaign ? campaign.description : undefined}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <DatepickerField
            name="date_start"
            title="Começa em"
            full={campaign ? true : false}
            date={campaign ? dayjs(campaign.date_start) : date}
          />
          <DatepickerField
            name="date_end"
            title="Termina em"
            full={campaign ? true : false}
            date={
              campaign
                ? dayjs(campaign.date_end)
                : (date as Dayjs).add(7, "days")
            }
          />
        </div>
        <SelectField
          name="status"
          title="Status"
          items={statusItems}
          value={campaign ? campaign.status : undefined}
        />

        <div className="flex items-center justify-end gap-2 pt-4">
          {campaign && (
            <Form method="post">
              <input type="hidden" name="id" value={campaign.id} />
              <input type="hidden" name="action" value="delete-campaign" />
              <Button>Excluir</Button>
            </Form>
          )}
          <Button primary type="submit">
            {campaign ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
