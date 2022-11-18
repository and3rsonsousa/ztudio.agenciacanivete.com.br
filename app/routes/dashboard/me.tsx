import type { LoaderFunction } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import InputField from "~/components/Forms/InputField";
import { getUser } from "~/lib/auth.server";
import { getPersonByUser } from "~/lib/data";
import type { PersonModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: {
      session: { user },
    },
  } = await getUser(request);

  const { data: person } = await getPersonByUser(user.id, request);

  return { user, person };
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
          <InputField title="Nome" name="name" value={person.name} />
          <InputField title="Email" name="email" value={person.email} />
          <InputField title="Senha" name="password" />
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
