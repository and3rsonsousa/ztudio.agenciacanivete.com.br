import { ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";

export default function SelectField({
  title,
  name,
  value,
  items,
  disabled,
  placeholder,
  onChange,
}: {
  title: string;
  name: string;
  value?: string;
  items?: { title: string; value: string }[];
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  const [selectedValue, setValue] = useState(value);

  return (
    <label className="field relative">
      <span className="field-label">{title}</span>
      <Select.Root
        value={selectedValue}
        onValueChange={(value) => {
          if (onChange) {
            onChange(value);
          }

          setValue(value);
        }}
        name={name}
        disabled={disabled}
      >
        <Select.Trigger className="field-input flex items-center justify-between disabled:cursor-not-allowed disabled:text-gray-300">
          <Select.Value placeholder={placeholder ?? "Selecione um item"} />
          <Select.Icon>
            <ChevronDownIcon className="w-4" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-xl border border-black/10 bg-gray-100/50 backdrop-blur">
            <Select.SelectScrollUpButton className="py-2">
              <ChevronUpIcon className="mx-auto w-6 text-gray-700" />
            </Select.SelectScrollUpButton>
            <Select.Viewport>
              {items &&
                items.map((item, index) => (
                  <Select.Item
                    value={item.value}
                    key={index}
                    className="spacing cursor-pointer text-sm text-gray-700 antialiased focus:bg-brand focus:text-white focus:outline-none"
                  >
                    <Select.ItemText className="">{item.title}</Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>
            <Select.SelectScrollDownButton>
              <ChevronUpDownIcon className="w-3" />
            </Select.SelectScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
