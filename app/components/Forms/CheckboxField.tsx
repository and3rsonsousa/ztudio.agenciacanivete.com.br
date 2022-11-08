import { CheckIcon } from "@heroicons/react/20/solid";

export default function CheckboxField({
  name,
  value,
  title,
  checked,
  onChange,
}: {
  name: string;
  value?: string;
  title: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="field field-checkbox">
      <input
        value={value}
        name={name}
        type="checkbox"
        defaultChecked={checked}
        onChange={onChange}
      />
      <div className="checkbox">
        <CheckIcon />
      </div>
      <span className="field-label">{title}</span>
    </label>
  );
}
