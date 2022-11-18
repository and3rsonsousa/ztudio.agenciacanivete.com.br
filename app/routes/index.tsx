import { useNavigate } from "@remix-run/react";
import Button from "~/components/Button";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className="grid h-screen place-content-center selection:bg-brand selection:text-white">
      <div className="w-96 text-center">
        <div>
          <img src="/logo.png" alt="STUDIO" className="mx-auto mb-8 w-32" />
        </div>
        <p>
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
        <div className="mt-16 space-x-2">
          <Button onClick={() => navigate("/dashboard")}>Entrar</Button>
        </div>
      </div>
    </div>
  );
}
