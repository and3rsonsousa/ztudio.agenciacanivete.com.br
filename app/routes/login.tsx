import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useSearchParams } from "@remix-run/react";
import Button from "~/components/Forms/Button";
import Field from "~/components/Forms/Field";
import { commitSession, getSession } from "~/lib/session.server";
import { supabase } from "~/lib/supabase";

export const action: ActionFunction = async ({ request }) => {
  //validar dados
  const formData = await request.formData();
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;

  // if()

  //fazer ações

  let session = await getSession();
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  let user = data.user;

  if (!user || error) {
    return {
      error: { message: `Senha ou usuário inválidos.\n${error?.message}` },
    };
  } else {
    session.set("userId", user.id);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) return redirect("/dashboard");
  return "";
};

export default function Login() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <div className="mb-8 w-32">
          <img src="/logo.png" alt="STUDIO" />
        </div>
        <Form method="post">
          <Field name="email" title="E-mail" type="email" />
          <Field name="password" title="Senha" type="password" />

          <div className="space-x-2 text-right">
            <Button primary>Entrar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
