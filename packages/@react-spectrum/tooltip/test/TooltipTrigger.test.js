import {ActionButton} from '@react-spectrum/button';
import {cleanup, fireEvent, render, wait, waitForDomChange} from '@testing-library/react';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import scaleMedium from '@adobe/spectrum-css-temp/vars/spectrum-medium-unique.css';
import themeLight from '@adobe/spectrum-css-temp/vars/spectrum-light-unique.css';
import {Tooltip, TooltipTrigger} from '../';
import {triggerPress} from '@react-spectrum/test-utils';

let theme = {
  light: themeLight,
  medium: scaleMedium
};

describe('TooltipTrigger', function () {
  let onOpen = jest.fn();
  let onClose = jest.fn();

  afterEach(() => {
    onOpen.mockClear();
    onClose.mockClear();
    cleanup();
  });

  describe('handles defaults', function () {

    it('should return proper ids', async function () {
      let {getByRole} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="click">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByRole('button');
      triggerPress(button);

      let tooltip = getByRole('tooltip');

      // wait for appearance
      await wait(() => {
        expect(tooltip).toBeVisible();
      });

      expect(tooltip.id).toBeTruthy();
      expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  describe('click related tests', function () {

    it('a click event can open the tooltip', async function () {
      let {getByRole} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="click">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByRole('button');
      triggerPress(button);

      let tooltip = getByRole('tooltip');

      await wait(() => {
        expect(tooltip).toBeVisible();
      });
    });

    it('a click event can close the tooltip', async function () {
      let {getByText} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="click">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByText('Trigger');
      triggerPress(button);

      let tooltip = getByText('content');

      expect(tooltip).toBeInTheDocument();

      triggerPress(button);

      await new Promise((a) => setTimeout(a, 300));

      expect(tooltip.id).not.toBeTruthy();
      expect(button).not.toHaveAttribute('aria-describedby', tooltip.id);
    });

    it('pressing escape should close the tooltip after a click event', async function () {
      let {getByRole} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="click">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByRole('button');
      triggerPress(button);

      let tooltip = getByRole('tooltip');

      // wait for appearance
      await wait(() => {
        expect(tooltip).toBeInTheDocument();
      });

      fireEvent.keyDown(button, {key: 'Escape'});
      await waitForDomChange();

      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('focus related tests', function () {

    it('pressing escape if the trigger is focused should close the tooltip', async function () {
      let {getByText} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="hover">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByText('Trigger');
      fireEvent.mouseOver(button);

      await new Promise((b) => setTimeout(b, 300));

      let tooltip = getByText('content');
      expect(tooltip).toBeInTheDocument();

      fireEvent.focus(button);
      fireEvent.keyDown(button, {key: 'Escape'});
      await waitForDomChange();

      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('hover related tests', function () {

    it('a mouseOver event can open the tooltip', async function () {
      let {getByText} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="hover">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByText('Trigger');
      fireEvent.mouseOver(button);

      await new Promise((c) => setTimeout(c, 300));

      let tooltip = getByText('content');
      expect(tooltip).toBeInTheDocument();
    });

    it('a mouseOut event can close the tooltip', async function () {
      let {getByText} = render(
        <Provider theme={theme}>
          <TooltipTrigger type="hover">
            <ActionButton>Trigger</ActionButton>
            <Tooltip>content</Tooltip>
          </TooltipTrigger>
        </Provider>
      );

      let button = getByText('Trigger');
      fireEvent.mouseOver(button);

      await new Promise((c) => setTimeout(c, 300));

      let tooltip = getByText('content');
      expect(tooltip).toBeInTheDocument();

      fireEvent.mouseOut(button);

      await new Promise((d) => setTimeout(d, 300));

      expect(tooltip.id).not.toBeTruthy();
      expect(button).not.toHaveAttribute('aria-describedby', tooltip.id);
    });
  });
});
