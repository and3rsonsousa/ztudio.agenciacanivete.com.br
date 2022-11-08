import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Forms/Button";
import CheckboxField from "~/components/Forms/CheckboxField";
import InputField from "~/components/Forms/InputField";
import { getAccount, getPersons, handleAction } from "~/lib/data";
import type { AccountModel, PersonModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, params }) => {
  const [{ data: account }, { data: persons }] = await Promise.all([
    getAccount(request, undefined, params.id as string),
    getPersons(request),
  ]);

  return { account, persons };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const { data, error } = await handleAction(formData, request);

  return { data, error };
};

export default function UserId() {
  const { account, persons } = useLoaderData<{
    account: AccountModel;
    persons: PersonModel[];
  }>();
  const actionData = useActionData<{
    data?: any;
    error?: { message: string };
  }>();

  return (
    <div className="h-full w-1/2 max-w-md border-l p-4 lg:px-8">
      <h4 className="mb-4">Atualizar Cliente</h4>
      {actionData?.error && (
        <Exclamation type="error">{actionData.error.message}</Exclamation>
      )}
      <Form method="post" className="mt-4">
        <input type="hidden" name="action" value="update-account" />
        <input type="hidden" name="id" value={account.id} />

        <InputField name="name" title="Nome" value={account.name} />
        <InputField name="slug" title="Slug" value={account.slug} />

        <div className="mt-8">
          {persons.map((person) => (
            <CheckboxField
              key={person.id}
              name="users"
              title={person.name}
              value={person.user}
              checked={
                account.users.filter((user) => user === person.user).length > 0
              }
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" primary>
            Atualizar
          </Button>
        </div>
      </Form>
    </div>
  );
}
