import { redirect } from "@remix-run/cloudflare";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Form, useActionData, useTransition } from "@remix-run/react";
import Button from "~/components/Button";
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
  return null;
};

export default function Login() {
  const transition = useTransition();
  const isLoading =
    transition.state !== "idle" &&
    transition.submission?.formData.get("action") === "login";

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <div className="mb-8 w-32">
          <img src="/logo.png" alt="STUDIO" />
        </div>
        <Form method="post">
          <Field name="email" title="E-mail" type="email" />
          <Field name="password" title="Senha" type="password" />
          <input type="hidden" name="action" value="login" />

          <div className="space-x-2 text-right">
            <Button primary type="submit" loading={isLoading}>
              Entrar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
