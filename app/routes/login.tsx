import { redirect } from "@remix-run/cloudflare";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import Button from "~/components/Forms/Button";
import Field from "~/components/Forms/InputField";
import { signIN } from "~/lib/auth.server";
import { getSession } from "~/lib/session.server";

export const action: ActionFunction = async ({ request }) => {
  //validar dados
  const formData = await request.formData();
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;

  return signIN(email as string, password as string, request);
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) return redirect("/dashboard");
  return "";
};

export default function Login() {
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
