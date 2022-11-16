import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/lib/auth.server";
import { getActions } from "~/lib/data";

export const loader: LoaderFunction = async ({ request, params }) => {
  const {
    data: {
      session: { user },
    },
  } = await getUser(request);
  const { data, error } = await getActions({
    request,
    user: user.id,
  });

  return { data, error };
};

export default function Test() {
  const { data, error } = useLoaderData();

  return (
    <div>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(error, undefined, 2)}
      </pre>
      <hr />
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </div>
  );
}
