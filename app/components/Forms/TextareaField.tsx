import { useState } from "react";

export default function TextareaField({
  name,
  title,
  value,
  lines,
  onChange,
}: {
  name: string;
  title: string;
  value?: string;
  lines?: number;
  onChange?: (value: string) => void;
}) {
  const [Value, setValue] = useState(value);

  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <textarea
        value={Value}
        name={name}
        className="field-input"
        rows={lines}
        onChange={(event) => {
          setValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
      ></textarea>
    </label>
  );
}
