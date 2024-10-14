import React, { useContext } from "react";
import {
  UNSTABLE_Disclosure as AriaDisclosure,
  UNSTABLE_DisclosureGroup as AriaDisclosureGroup,
  DisclosureProps as AriaDisclosureProps,
  DisclosureGroupProps as AriaDisclosureGroupProps,
  UNSTABLE_DisclosurePanel as AriaDisclosurePanel,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  composeRenderProps,
  Heading,
  Button,
  DisclosureStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ChevronRight } from "lucide-react";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { DisclosureGroupStateContext } from "react-aria-components";

const disclosure = tv({
  base: "w-64 border rounded-lg bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600 dark:hover:border-zinc-500 outline-none",
});

const disclosureInGroup = tv({
  extend: disclosure,
  base: "border-0 border-b last:border-b-0 rounded-b-none last:rounded-b-lg",
});

const disclosureButton = tv({
  extend: focusRing,
  base: "rounded-lg flex gap-2 items-center w-full text-start p-2 cursor-default",
  variants: {
    isDisabled: {
      true: 'text-gray-300 dark:text-zinc-600 forced-colors:text-[GrayText]'
    }
  }
});

const chevron = tv({
  base: "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ease-in-out",
  variants: {
    isExpanded: {
      true: "transform rotate-90",
    },
    isDisabled: {
      true: 'text-gray-300 dark:text-zinc-600 forced-colors:text-[GrayText]'
    }
  }
});

export interface DisclosureProps extends AriaDisclosureProps {
  children: React.ReactNode;
}

export function Disclosure({ children, ...props }: DisclosureProps) {
  let isInGroup = useContext(DisclosureGroupStateContext) !== null;
  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        isInGroup ? disclosureInGroup({ ...renderProps, className }) : disclosure({ ...renderProps, className })
      )}
    >
      {children}
    </AriaDisclosure>
  );
}

export interface DisclosureHeaderProps {
  children: React.ReactNode;
}

export function DisclosureHeader({ children }: DisclosureHeaderProps) {
  let { isExpanded } = useContext(DisclosureStateContext)!;
  return (
    <Heading className="text-base font-medium">
      <Button
        slot="trigger"
        className={(renderProps) => disclosureButton(renderProps)}
      >
        {({isDisabled}) => (
          <>
            <ChevronRight aria-hidden className={chevron({ isExpanded, isDisabled })} />
            {children}
          </>
        )}
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps extends AriaDisclosurePanelProps {
  children: React.ReactNode;
}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel {...props} className={composeTailwindRenderProps(props.className, 'px-4 py-2')}>
      {children}
    </AriaDisclosurePanel>
  );
}

export interface DisclosureGroupProps extends AriaDisclosureGroupProps {
  children: React.ReactNode;
}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return (
    <AriaDisclosureGroup {...props} className={composeTailwindRenderProps(props.className, 'border border-gray-200 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 rounded-lg')}>
      {children}
    </AriaDisclosureGroup>
  );
}
