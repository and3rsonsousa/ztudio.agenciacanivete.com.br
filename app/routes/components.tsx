export default function Components() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <button className="button button-small">Fazer Login</button>
      </div>
      <div>
        <button className="button">Fazer Login</button>
      </div>
      <div>
        <button className="button button-large">Fazer Login</button>
      </div>
      <div>
        <button className="button button-primary button-small">
          Fazer Login
        </button>
      </div>
      <div>
        <button className="button button-primary">Fazer Login</button>
      </div>
      <div>
        <button className="button button-primary button-large">
          Fazer Login
        </button>
      </div>
      <div>
        <button disabled={true} className="button">
          Fazer Login
        </button>
      </div>
      <div>
        <button disabled className="button button-primary">
          Fazer Login
        </button>
      </div>
    </div>
  );
}
