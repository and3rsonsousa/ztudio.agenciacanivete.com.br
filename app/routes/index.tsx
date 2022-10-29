import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="grid h-screen place-content-center">
      <div className="w-96 text-center">
        <h1 className="mb-8 text-brand">Studio</h1>
        <p>
          Sistema de gestão de ações criado
          <br /> e mantido pela{" "}
          <a
            href="https://agenciacanivete.com.br"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Agência Canivete
          </a>
          .
        </p>
        <div className="mt-16 space-x-2">
          <Link to={`/login?signup`} className="button button-link">
            Criar Conta
          </Link>
          <Link to={`/login`} className="button button-primary">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
