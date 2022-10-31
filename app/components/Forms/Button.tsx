export default function Button({
  children,
  small,
  large,
  primary,
  disabled,
  link,
}: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
}) {
  return (
    <button
      className={`button${small ? " button-small" : ""}${
        large ? " button-large" : ""
      }${primary ? " button-primary" : ""}${link ? " button-link" : ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
