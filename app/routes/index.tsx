import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import Button from "~/components/Button";
import { getUser } from "~/lib/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: { session },
    response,
  } = await getUser(request, true);

  if (session !== null) {
    throw redirect(`/dashboard`, { headers: response.headers });
  }

  return { session };
};

export default function Index() {
  return (
    <div className="selection:bg-brand selection:text-white">
      <div className="grid min-h-screen place-content-center ">
        <div className="z-10 w-96 text-center">
          <div>
            {/* <img src="/logo.png" alt="STUDIO" className="mx-auto mb-8 w-32" /> */}
            <img src="/logo.png" alt="STUDIO" className="mx-auto mb-8 w-36" />
          </div>
          <p className="text-center font-normal">
            Sistema de gestão de ações criado
            <br /> e mantido pela{" "}
            <a
              href="https://agenciacanivete.com.br"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              αɢêɴᴄɪα ᴄαɴɪᴠeᴛe
            </a>
            .
          </p>
          <div className="mt-8">
            <Button primary icon asChild>
              <a href="/dashboard">
                <span>Entrar</span>
                <UserCircleIcon />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
