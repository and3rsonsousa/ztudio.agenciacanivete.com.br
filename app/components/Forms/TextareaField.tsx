// import { useState } from "react";

// export default function TextareaField({
//   name,
//   title,
//   value,
//   lines,
//   onChange,
// }: {
//   name: string;
//   title: string;
//   value?: string;
//   lines?: number;
//   onChange?: (value: string) => void;
// }) {
//   const [Value, setValue] = useState(value);

//   return (
//     <label className="field">
//       <span className="field-label">{title}</span>
//       <textarea
//         value={Value}
//         name={name}
//         className="field-input"
//         rows={lines}
//         onChange={(event) => {
//           setValue(event.target.value);
//           if (onChange) onChange(event.target.value);
//         }}
//       ></textarea>
//     </label>
//   );
// }

import { useRef } from "react";
import { FocusRing, useTextField } from "react-aria";

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

  const { labelProps, inputProps } = useTextField(
    { ...props, inputElementType: "textarea" },
    inputRef
  );

  return (
    <div className="field">
      <label {...labelProps} className="field-label">
        {label}
      </label>
      <FocusRing within={true} focusClass="ring-brand ring-2 border-brand">
        <textarea
          {...inputProps}
          rows={rows}
          ref={inputRef}
          className={`w-full rounded-xl bg-gray-100 py-3 px-5 outline-none`}
        />
      </FocusRing>
    </div>
  );
}
