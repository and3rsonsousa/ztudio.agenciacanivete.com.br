import React from "react";

export default function Button({
  children,
  small,
  large,
  primary,
  disabled,
  link,
  icon,
  title,
  onClick,
  type,
}: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
  icon?: boolean;
  title?: string;
  type?: "submit" | "reset" | "button";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      title={title}
      type={type}
      className={`button${small ? " button-small" : ""}${
        large ? " button-large" : ""
      }${primary ? " button-primary" : ""}${link ? " button-link" : ""}${
        icon ? " button-icon" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
