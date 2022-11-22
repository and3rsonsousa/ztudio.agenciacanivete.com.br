import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import Button from "~/components/Button";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="grid h-[70vh] place-content-center bg-gradient-to-br from-brave via-brand to-vivid selection:bg-brand selection:text-white">
        <div className="w-96 text-center">
          <div>
            {/* <img src="/logo.png" alt="STUDIO" className="mx-auto mb-8 w-32" /> */}
            <img
              src="/logo-studio-white.svg"
              alt="STUDIO"
              className="mx-auto mb-8 w-52"
            />
          </div>
          <p className="text-center font-normal text-white">
            Sistema de gestão de ações criado
            <br /> e mantido pela{" "}
            <a
              href="https://agenciacanivete.com.br"
              target="_blank"
              rel="noreferrer"
            >
              αɢêɴᴄɪα ᴄαɴɪᴠeᴛe
            </a>
            .
          </p>
        </div>
      </div>
      <div className="grid h-[30vh] place-content-center space-x-2">
        <Button large primary icon onClick={() => navigate("/dashboard")}>
          <div>Entrar</div>
          <UserCircleIcon />
        </Button>
      </div>
    </div>
  );
}
