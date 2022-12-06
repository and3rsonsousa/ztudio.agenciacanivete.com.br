import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { ActionMedium, Actions } from "~/components/Actions";
import { getActions } from "~/lib/data";
import type { ActionModel } from "~/lib/models";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data } = await getActions({
    request,
    all: true,
    account: params.slug,
  });

  return { actions: data };
};

export default function ActionsPages() {
  const { actions } = useLoaderData<{ actions: ActionModel[] }>();

  return <Actions actions={actions} />;
}
