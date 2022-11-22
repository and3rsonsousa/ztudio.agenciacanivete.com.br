import React, { useRef } from "react";
import { FocusRing, useButton, useHover } from "react-aria";
import Loader from "./Loader";

export default function Button({
  children,
  small,
  large,
  squared,
  primary,
  disabled,
  link,
  icon,
  title,
  className = "",
  type,
  loading,
  isSuffix,
  isPreffix,
  onClick,
}: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  squared?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
  icon?: boolean;
  title?: string;
  className?: string;
  type?: "submit" | "reset" | "button";
  loading?: boolean;
  isSuffix?: boolean;
  isPreffix?: boolean;
  onClick?: (event: any) => void;
}) {
  const buttonRef = useRef(null);

  const { buttonProps, isPressed } = useButton(
    {
      onPress: (event) => {
        if (onClick) onClick(event);
      },

      "aria-label": title,
      type,
    },
    buttonRef
  );

  const { isHovered, hoverProps } = useHover({});

  return (
    <FocusRing
      focusClass={`ring-2 ring-brand ${
        primary ? "ring-offset-2 dark:ring-offset-gray-1000" : ""
      }`}
    >
      <button
        {...hoverProps}
        {...buttonProps}
        style={{ WebkitTapHighlightColor: "transparent" }}
        className={`button ${primary ? "button-primary" : ""} ${
          isHovered && !disabled ? " bg-button-hover" : "bg-button"
        } ${isPressed ? " bg-button-pressed" : "bg-button"} ${
          small ? " button-small " : large ? "button-large" : ""
        } ${icon ? "button-icon" : ""} ${squared ? "button-squared" : ""} ${
          link ? "button-link" : ""
        } ${className} ${
          isSuffix ? "h-12 rounded-r-none rounded-l-xl px-4" : ""
        } ${isPreffix ? "h-12 rounded-l-none rounded-r-xl px-4" : ""}`}
        disabled={disabled}
      >
        {loading ? <Loader /> : children}
      </button>
    </FocusRing>
  );
}
