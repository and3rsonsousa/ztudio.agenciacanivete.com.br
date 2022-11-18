import { useNavigate } from "@remix-run/react";
import React, { useRef } from "react";
import { useState } from "react";
import { FocusRing, useButton, useHover } from "react-aria";

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
  onClick?: () => void;
}) {
  const buttonRef = useRef(null);

  const { buttonProps, isPressed } = useButton(
    {
      onPress: () => {
        if (onClick) onClick();
      },

      "aria-label": title,
      type,
    },
    buttonRef
  );

  const { isHovered, hoverProps } = useHover({});

  return (
    <FocusRing focusRingClass="ring ring-brand">
      <button
        {...hoverProps}
        {...buttonProps}
        style={{ WebkitTapHighlightColor: "transparent" }}
        className={`button ${primary ? "button-primary" : ""} ${
          isHovered && !disabled ? " bg-button-hover" : "bg-button"
        } ${isPressed ? " bg-button-pressed" : "bg-button"} ${
          small ? " button-small " : large ? "button-large" : ""
        } ${icon ? "button-icon" : ""} ${link ? "button-link" : ""}`}
        disabled={disabled}
      >
        {children}
      </button>
    </FocusRing>
  );
}
