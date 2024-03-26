import '../src/page';
import {themes} from '@storybook/theming';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { store } from 'storybook-dark-mode/dist/esm/Tool';
import { addons } from '@storybook/preview-api';
import { DocsContainer } from '@storybook/addon-docs';
import React, { useEffect, useState } from 'react';
import './global.css';

const channel = addons.getChannel();
document.documentElement.dataset.colorScheme = store().current === 'dark' ? 'dark' : 'light';
channel.on(DARK_MODE_EVENT_NAME, isDark => document.documentElement.dataset.colorScheme = isDark ? 'dark' : 'light');

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {},
    },
    docs: {
      container: (props) => {
        let [dark, setDark] = useState(store().current === 'dark');
        useEffect(() => {
          channel.on(DARK_MODE_EVENT_NAME, setDark);
          return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
        }, []);
        return <DocsContainer {...props} theme={dark ? themes.dark : themes.light} />;
      },
      source: {
        // code: null, // Will disable code button, and show "No code available"
        transform: (code: string) => {
          // Replace any <_ with <
          code = code.replace(/<\s?_/g, '<');
          // Replace any </_ with </
          code = code.replace(/<\/\s?_/g, '</');
          // Remove any className prop
          code = code.replace(/\s+className=".*"/g, '');
          // Remove any styles prop
          code = code.replace(/\s+styles=".*"/g, '');
          // Remove any on* prop
          code = code.replace(/\s+on[A-Z].*={.*}/g, '');
          return code;
        }
      }
    }
  },
};

export const parameters = {
  options: {
    storySort: (a: any, b: any) => a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-hidden-focus',
          selector: 'body *:not([data-a11y-ignore="aria-hidden-focus"])',
        }
      ]
    }
  },
  layout: 'fullscreen'
};

export default preview;
