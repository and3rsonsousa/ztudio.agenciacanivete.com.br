import React from "react";

export default function Button({
  children,
  small,
  large,
  primary,
  disabled,
  link,
  onClick,
}: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      className={`button${small ? " button-small" : ""}${
        large ? " button-large" : ""
      }${primary ? " button-primary" : ""}${link ? " button-link" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
