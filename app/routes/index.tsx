import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import Button from "~/components/Button";

export default function Index() {
  const navigate = useNavigate();
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
            <Button primary icon onClick={() => navigate("/dashboard")}>
              <div>Entrar</div>
              <UserCircleIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
