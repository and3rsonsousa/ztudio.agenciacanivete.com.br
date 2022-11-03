import { CheckIcon } from "@heroicons/react/20/solid";

export default function Checkbox({
  name,
  title,
  checked,
  onChange,
}: {
  name: string;
  title: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="field field-checkbox">
      <input
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
