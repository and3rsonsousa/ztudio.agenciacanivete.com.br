import * as Select from "@radix-ui/react-select";

export default function SelectBox() {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Item>
              <Select.ItemText />
              <Select.ItemIndicator />
            </Select.Item>
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
