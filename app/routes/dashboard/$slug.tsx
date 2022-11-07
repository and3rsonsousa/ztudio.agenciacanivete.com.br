import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { handleAction, getAccount } from "~/lib/data";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.account.name} / ꜱᴛᴜᴅɪᴏ`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: account } = await getAccount(request, params.slug);

  return { account };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

export default function Slug() {
  const loaderData = useLoaderData();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <h2 className="mb-0 dark:text-gray-200">{loaderData.account.name}</h2>
      </div>
      <Outlet context={useOutletContext()} />
    </div>
  );
}
