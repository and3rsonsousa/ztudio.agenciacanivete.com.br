import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

import * as Select from "@radix-ui/react-select";
import { useState } from "react";

type SelectItemModel = { title: string; value: string };

export default function SelectField({
  title,
  name,
  value,
  items,
  disabled,
  small,
  link,
  placeholder,
  onChange,
}: {
  name: string;
  title?: React.ReactNode;
  value?: string;
  items: SelectItemModel[] | SelectItemModel[][];
  disabled?: boolean;
  small?: boolean;
  link?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  const [selectedValue, setValue] = useState(value);

  const _items = Array.isArray(items[0]) ? items : [items];

  return (
    <label className="select-field field relative">
      {title && <span className="field-label">{title}</span>}
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
        <Select.Trigger
          className={`field-default flex items-center justify-between disabled:cursor-not-allowed ${
            link ? "field-link" : ""
          } ${small ? "button-small" : ""}`}
        >
          <Select.Value
            placeholder={placeholder ?? "Selecione um item"}
          ></Select.Value>

          <Select.Icon className="-mr-3 ml-1">
            <ChevronDownIcon className="w-6" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="dropdown-content">
            <Select.SelectScrollUpButton
              className={`${small ? "py-1" : "py-2"}`}
            >
              <ChevronUpIcon
                className={`mx-auto  text-gray-700 dark:text-gray-400 ${
                  small ? "w-4" : "w-6"
                }`}
              />
            </Select.SelectScrollUpButton>
            <Select.Viewport>
              {_items?.length
                ? _items.map((__items, index) => (
                    <Select.Group key={index}>
                      {index > 0 && <hr className="dropdown-hr" />}
                      {(__items as SelectItemModel[]).map((item, index) => (
                        <Select.Item
                          value={item.value}
                          key={item.value}
                          className={`dropdown-item${
                            small ? " item-small" : ""
                          } flex justify-between`}
                        >
                          <Select.ItemText>{item.title}</Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckCircleIcon className="ml-2 w-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  ))
                : null}
            </Select.Viewport>

            <Select.SelectScrollDownButton
              className={`${small ? "py-1" : "py-2"} py-2`}
            >
              <ChevronDownIcon
                className={`mx-auto  text-gray-700 dark:text-gray-400 ${
                  small ? "w-4" : "w-6"
                }`}
              />
            </Select.SelectScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
