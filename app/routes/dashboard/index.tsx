import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);

  return { coisa: data };
};

export default function Dashboard() {
  // const loaderResponse = useLoaderData();
  return (
    <Layout>
      {/* {JSON.stringify(loaderResponse)} */}
      <Calendar />
    </Layout>
  );
}
