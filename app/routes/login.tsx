import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useNavigation } from "@remix-run/react";
import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
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

const quotes: Array<{ quote: string; author: string }> = [
  {
    quote:
      "A melhor maneira de persuadir as pessoas é com os ouvidos – ouvindo a elas",
    author: "Dean Rusk, ex-Secretário de Estado dos Estados Unidos.",
  },
  {
    quote:
      "Satisfazer os clientes não é mais o suficiente: é preciso encantá-los",
    author: "Philip Kotler",
  },
  {
    quote:
      "Faça aquilo que você faz tão bem que eles vão desejar ver novamente e trazer seus amigos.",
    author: "Walt Disney",
  },
  {
    quote:
      "Seus clientes mais insatisfeitos são sua maior fonte de aprendizado",
    author: "Bill Gates",
  },
  {
    quote:
      "Se você não está falhando de vez em quando, é um sinal de que você não está fazendo nada de inovador.",
    author: "Woody Allen",
  },
  {
    quote:
      "A falha é simplesmente a oportunidade de começar novamente, desta vez de forma mais inteligente.",
    author: "Henry Ford",
  },
  {
    quote: "Se você não entende as pessoas, você não entenderá os negócios.",
    author: "Simon Sinek",
  },
];

export const quote = quotes[Math.floor(Math.random() * quotes.length)];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const transition = useNavigation();
  const isLoading =
    transition.state !== "idle" &&
    transition.formData?.get("action") === "login";

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-3xl grid-cols-2 place-items-center p-8  md:grid">
        <div className="w-full p-8">
          <div className="mb-8 w-32">
            <img src="/logo-color.svg" alt="STUDIO" />
          </div>
          <Form method="post">
            <Field name="email" label="E-mail" type="email" />
            <Field
              name="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              suffix={
                <Button
                  icon
                  isPreffix
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Lock /> : <Unlock />}
                </Button>
              }
            />
            <input type="hidden" name="action" value="login" />

            <div className="space-x-2 text-right">
              <Button primary type="submit" loading={isLoading}>
                Entrar
              </Button>
            </div>
          </Form>
        </div>
        <div className="relative w-full p-8">
          <div className="absolute -top-12 right-0  text-[120px] font-bold text-gray-200 dark:text-gray-700">
            ”
          </div>
          <div className="relative text-xl leading-normal">{quote.quote}</div>
          <div className="mt-8 text-xs font-medium uppercase tracking-widest text-gray-400">
            {quote.author}
          </div>
        </div>
      </div>
    </div>
  );
}
