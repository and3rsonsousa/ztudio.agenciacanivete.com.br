import React from "react";

export default function Button({
  children,
  small,
  large,
  primary,
  disabled,
  link,
  onClick,
  type,
}: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type={type}
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
