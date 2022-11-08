import React, { useState } from "react";

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

  onChange?: (value: string) => void;
}) {
  const [Value, setValue] = useState(value);

  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <input
        type={type ?? "text"}
        className="field-input"
        placeholder={placeholder ?? title}
        name={name}
        value={Value}
        onChange={(event) => {
          setValue(event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
        pattern={pattern}
        required={required}
      />
    </label>
  );
}
