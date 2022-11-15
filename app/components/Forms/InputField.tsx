import dayjs from "dayjs";

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
  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <input
        type={type ?? "text"}
        className="field-input"
        placeholder={placeholder ?? title}
        name={name}
        defaultValue={
          type === "datetime-local"
            ? dayjs(value).format("YYYY-MM-DD[T]HH:mm")
            : value
        }
        onChange={(event) => {
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
