import dayjs from "dayjs";
import { useRef } from "react";
import { FocusRing, useTextField } from "react-aria";

export default function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  pattern,
  required,
  suffix,
  preffix,
  onChange,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "datetime-local";
  placeholder?: string;
  value?: string;
  pattern?: string;
  required?: boolean;
  preffix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
}) {
  const inputRef = useRef(null);
  const props = {
    label,
    type,
    name,
    placeholder,
    defaultValue:
      type === "datetime-local"
        ? dayjs(value).format("YYYY-MM-DD[T]HH:mm")
        : value,
    pattern,
    isRequired: required,
  };

  const { labelProps, inputProps } = useTextField(props, inputRef);

  return (
    <div className="field">
      <label {...labelProps} className="field-label">
        {label}
      </label>
      <FocusRing within={true} focusClass="ring-brand ring-2 border-brand">
        <div
          className={`flex h-12 items-center overflow-hidden rounded-xl bg-gray-100 `}
        >
          {preffix}

          <input
            {...inputProps}
            ref={inputRef}
            className={`w-full bg-transparent py-3 outline-none ${
              preffix !== undefined ? "pl-2" : "pl-5"
            } ${suffix !== undefined ? "pr-2" : "pr-5"}`}
          />

          {suffix}
        </div>
      </FocusRing>
    </div>
  );
}
