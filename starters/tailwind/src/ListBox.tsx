import { Check } from 'lucide-react';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Collection,
  Header,
  ListBoxItemProps,
  ListBoxProps,
  Section,
  SectionProps
} from 'react-aria-components';

export function ListBox<T extends object>(
  { children, ...props }: ListBoxProps<T>
) {
  return (
    <AriaListBox {...props} className="outline-none p-1 border rounded-lg">
      {children}
    </AriaListBox>
  );
}

export function ListBoxItem(props: ListBoxItemProps) {
  let textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className="group relative flex items-center gap-8 cursor-default select-none py-2 px-4 rounded-lg will-change-transform text-gray-900 disabled:text-gray-300 text-sm hover:bg-gray-200 selected:bg-blue-600 selected:text-white selected:[&:has(+[data-selected])]:rounded-b-none [&[data-selected]+[data-selected]]:rounded-t-none outline-none focus-visible:outline-blue-600 outline-offset-0 selected:focus-visible:outline-white selected:-outline-offset-4">
      {renderProps => <>
        {typeof props.children === 'function' ? props.children(renderProps) : props.children}
        <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20 hidden  [.group[data-selected]:has(+[data-selected])_&]:block" />
      </>}
    </AriaListBoxItem>
  );
}

export function DropdownItem(props: ListBoxItemProps) {
  let textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className="group flex items-center gap-8 cursor-default select-none py-2 pl-3 pr-1 rounded-lg outline-none text-gray-900 disabled:text-gray-300 text-sm focus:bg-blue-600 focus:text-white">
      {renderProps => <>
        <span className="flex-1 flex items-center gap-2 truncate font-normal group-selected:font-semibold">
          {typeof props.children === 'function' ? props.children(renderProps) : props.children}
        </span>
        <span className="w-5 flex items-center text-gray-900 group-focus:text-white">
          {renderProps.isSelected && <Check className="w-4 h-4" />}
        </span>
      </>}
    </AriaListBoxItem>
  );
}

export interface ListBoxSectionProps<T> extends SectionProps<T> {
  title?: string
}

export function ListBoxSection<T extends object>(props: ListBoxSectionProps<T>) {
  return (
    <Section className="first:-mt-[5px] after:content-[''] after:block after:h-[5px]">
      <Header className="text-sm font-semibold text-gray-500 px-3 py-1 sticky -top-[5px] -mt-px -mx-1 z-10 bg-gray-100/60 backdrop-blur-md supports-[-moz-appearance:none]:bg-gray-100 border-y [&+*]:mt-1">{props.title}</Header>
      <Collection items={props.items}>
        {props.children}
      </Collection>
    </Section>
  );
}
