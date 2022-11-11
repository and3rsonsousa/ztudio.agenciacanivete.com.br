import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/esm/locale";

export default function DatepickerField({
  title,
  pattern,
}: {
  title: string;
  pattern?: string;
}) {
  const date = new Date();
  const dateString = format(
    date,
    pattern ??
      "iiii, d 'de' MMMM 'de' y 'às' H'h'".concat(
        format(date, "mm") === "00" ? "" : "mm"
      ),
    {
      locale: ptBR,
    }
  );

  return (
    <label className="field">
      <div className="field-label">{title}</div>
      <Popover.Root>
        <Popover.Trigger asChild>
          <div className="field-input first-letter:capitalize">
            {dateString}
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="dropdown-content max-w-xs p-4 text-sm font-light antialiased outline-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias,
            dignissimos sunt. Commodi beatae debitis necessitatibus veniam,
            aperiam quis animi rerum vero modi eaque illum impedit, cumque
            ullam? In, quisquam quasi.
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </label>
  );
}
