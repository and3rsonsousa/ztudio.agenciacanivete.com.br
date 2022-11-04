export default function TextareaField({
  name,
  title,
  value,
  lines,
}: {
  name: string;
  title: string;
  value?: string;
  lines?: number;
}) {
  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <textarea
        defaultValue={value}
        name={name}
        className="field-input"
        rows={lines}
      ></textarea>
    </label>
  );
}
