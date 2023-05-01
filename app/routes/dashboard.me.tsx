import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { useContext } from "react";
import Button from "~/components/Button";
import Exclamation from "~/components/Exclamation";
import InputField from "~/components/Forms/InputField";
import { getUser } from "~/lib/auth.server";
import { getPersonByUser } from "~/lib/data";
import type { ContextType, PersonModel } from "~/lib/models";

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const { name, email } = Object.fromEntries(formData);

  console.log({ name, email });

  return {};
};

export default function Me() {
  const { person } = useLoaderData<{ person: PersonModel }>();
  const { supabase } = useOutletContext<ContextType>();
  const [error, setError] = useState<AuthError | null>(null);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <Link to={`/me`}>
          <h2 className="mb-0 dark:text-gray-200">Minha conta</h2>
        </Link>
      </div>
      <div className="max-w-md p-4">
        <Form method="post">
          <InputField label="Nome" name="name" value={person.name} />
          <InputField label="Email" name="email" value={person.email} />

          <div className="flex justify-end">
            <Button primary type="submit">
              Atualizar
            </Button>
          </div>
        </Form>
        <hr className="my-8 border-gray-800" />

        <div className="field">
          <label>
            <div className="field-label">Senha</div>
          </label>
          <button
            className="link text-brand"
            onClick={async () => {
              const { error } = await supabase.auth.resetPasswordForEmail(
                person.email
              );
              setError(error);
              console.log(error);
            }}
          >
            Clique aqui
          </button>{" "}
          para redefinir a sua Senha
        </div>
        {error ? <Exclamation type="error">{error.message}</Exclamation> : null}
      </div>
    </div>
  );
}
