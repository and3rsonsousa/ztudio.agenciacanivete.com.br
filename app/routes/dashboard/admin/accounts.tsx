import { LockClosedIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import Button from "~/components/Forms/Button";
import { getUser } from "~/lib/auth.server";
import { getAccounts, getPersonByUser, handleAction } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return await handleAction(formData, request);
};

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: {
      session: { user },
    },
  } = await getUser(request);

  const { data: person } = await getPersonByUser(user.id, request);

  if (!person.admin) {
    return redirect("/dashboard");
  }

  const { data: accounts } = await getAccounts(user.id, request);

  return { accounts };
};

export default function Accounts() {
  const { accounts } = useLoaderData<{ accounts: AccountModel[] }>();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="w-6" />

          <Link to={`/dashboard/admin/accounts`}>
            <h2 className="mb-0 dark:text-gray-200">Clientes</h2>
          </Link>
        </div>
      </div>
      <div className="flex h-full overflow-hidden">
        <div className="no-scrollbars w-1/2 max-w-md divide-y overflow-hidden overflow-y-auto">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="group flex items-center justify-between"
            >
              <Link
                to={`/dashboard/admin/accounts/${account.id}`}
                className="block py-4 px-8  font-medium focus:text-brand focus:outline-none"
              >
                {account.name}
              </Link>
              <div className="pr-2 opacity-0 transition group-hover:opacity-100">
                <Form method="post">
                  <input type="hidden" name="action" value="delete-account" />
                  <input type="hidden" name="id" value={account.id} />
                  <Button
                    small
                    link
                    onClick={(event) => {
                      if (
                        !window.confirm(
                          `Deseja mesmo deletar o cliente "${account.name}"`
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </Form>
              </div>
            </div>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
