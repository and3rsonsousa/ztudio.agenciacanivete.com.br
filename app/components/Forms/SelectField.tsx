import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

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
        <Select.Trigger className="field-input flex items-center justify-between disabled:cursor-not-allowed ">
          <Select.Value placeholder={placeholder ?? "Selecione um item"} />
          <Select.Icon className="-mr-3">
            {/* <ChevronUpDownIcon className="w-6" /> */}
            <ChevronDownIcon className="w-6" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="dropdown-content">
            <Select.SelectScrollUpButton className="py-2">
              <ChevronUpIcon className="mx-auto w-6 text-gray-700" />
            </Select.SelectScrollUpButton>
            <Select.Viewport>
              {items &&
                items.map((item, index) => (
                  <Select.Item
                    value={item.value}
                    key={index}
                    className="dropdown-item"
                  >
                    <Select.ItemText className="">{item.title}</Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>

            <Select.SelectScrollDownButton className="py-2">
              <ChevronDownIcon className="mx-auto w-6 text-gray-700" />
            </Select.SelectScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
