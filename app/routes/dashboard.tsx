import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Outlet, useOutletContext } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import {
  getAccounts,
  getCelebrations,
  getPersonByUser,
  getPersons,
  getTagsStatusAttributes,
} from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: { session },
    response,
  } = await getUser(request);

  if (!session) {
    throw redirect("/login", { headers: response.headers });
  }

  const userId = session.user.id;
  const [
    { data: person },
    { data: persons },
    { data: accounts },
    { tags, status, attributes },
    { data: celebrations },
  ] = await Promise.all([
    getPersonByUser(userId, request),
    getPersons(request),
    getAccounts(userId, request),
    getTagsStatusAttributes(request),
    getCelebrations({ request }),
  ]);
  const url = request.url;
  return {
    person,
    persons,
    accounts,
    tags,
    status,
    attributes,
    celebrations,
    url,
  };
};

export default function Dashboard() {
  const context = useOutletContext();
  return (
    <Layout>
      <Outlet context={context} />
    </Layout>
  );
}
