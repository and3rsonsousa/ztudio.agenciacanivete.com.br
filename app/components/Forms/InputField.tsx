import React from "react";

export default function InputField({
  title,
  name,
  type,
  placeholder,
  value,
  pattern,
  required,
  onChange,
}: {
  title: string;
  name: string;
  type?: "text" | "email" | "password" | "datetime-local";
  placeholder?: string;
  value?: string;
  pattern?: string;
  required?: boolean;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <input
        type={type ?? "text"}
        className="field-input"
        placeholder={placeholder ?? title}
        name={name}
        defaultValue={value}
        onChange={onChange}
        pattern={pattern}
        required={required}
      />
    </label>
  );
}
