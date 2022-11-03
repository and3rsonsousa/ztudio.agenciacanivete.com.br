import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions, handleAction } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);
  const [{ data: actions }] = await Promise.all([
    getActions({
      request,
      user: data.session.user.id,
    }),
  ]);

  return { actions };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

const DashboardIndex = () => {
  const { actions } = useLoaderData();
  return (
    <div className="h-screen">
      <Calendar actions={actions} />
    </div>
  );
};

export default DashboardIndex;
