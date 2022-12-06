import type { LoaderFunction } from "@remix-run/cloudflare";
import type { PersonModel } from "~/lib/models";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import InputField from "~/components/Forms/InputField";
import { getUser } from "~/lib/auth.server";
import { getPersonByUser } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: { session },
    response,
  } = await getUser(request);

  if (session === null) {
    return redirect(`/login`, { headers: response.headers });
  }

  const { data: person } = await getPersonByUser(session.user.id, request);

  return { person };
};

export default function Me() {
  const { person } = useLoaderData<{ person: PersonModel }>();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <Link to={`/dashboard/me`}>
          <h2 className="mb-0 dark:text-gray-200">Minha conta</h2>
        </Link>
      </div>
      <div className="max-w-md p-4">
        <div className="my-8">
          <Exclamation type="alert" icon>
            Funcionalidade não implementada
          </Exclamation>
        </div>
        <Form method="post">
          <InputField label="Nome" name="name" value={person.name} />
          <InputField label="Email" name="email" value={person.email} />
          <InputField label="Senha" name="password" />
          <div className="flex justify-end">
            <Button primary type="submit">
              Atualizar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
