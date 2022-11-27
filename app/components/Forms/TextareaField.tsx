import { useRef } from "react";

export default function TextareaField({
  label,
  name,
  placeholder,
  rows,
  value,
  required,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  pattern?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  const inputRef = useRef(null);
  const props = {
    label,
    name,
    placeholder,
    defaultValue: value,
    isRequired: required,
  };

  return (
    <div className="field">
      <label className="field-label">{label}</label>

      <textarea rows={rows} ref={inputRef} className={`field-default`} />
    </div>
  );
}
