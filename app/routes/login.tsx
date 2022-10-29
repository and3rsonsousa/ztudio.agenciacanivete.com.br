import { useSearchParams } from "@remix-run/react";

export default function Login() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <code>{searchParams.get("signup") !== null ? "YES" : "NO"}</code>
    </div>
  );
}
