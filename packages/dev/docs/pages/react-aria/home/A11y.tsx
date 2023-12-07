import {animate, useIntersectionObserver} from './utils';
import {Button} from '../../../../../../starters/tailwind/src/Button';
import {ChevronDown, WifiIcon} from 'lucide-react';
import {createPortal, flushSync} from 'react-dom';
import {Key, useDateFormatter} from 'react-aria';
import {Label} from '../../../../../../starters/tailwind/src/Field';
import {ListBox, Select, SelectValue} from 'react-aria-components';
import {Popover} from '../../../../../../starters/tailwind/src/Popover';
import React, {useEffect, useRef, useState} from 'react';
import {SelectItem} from '../../../../../../starters/tailwind/src/Select';

interface Point {
  top: number,
  left: number
}

interface Rect extends Point {
  width: number,
  height: number
}

const swipeRightKeyframes: PropertyIndexedKeyframes = {
  transform: [
    'translate(80px, 0)',
    'translate(80px, 0)',
    'translate(-80px, 0)',
    'translate(-80px, 0)'
  ],
  opacity: [
    0,
    0.3,
    0.3,
    0
  ],
  offset: [0, 0.2, 0.8, 1],
  easing: 'ease-in-out'
};

const doubleTapKeyframes: PropertyIndexedKeyframes = {
  opacity: [
    0,
    0.3,
    0.15,
    0.3,
    0
  ],
  easing: 'ease-in-out'
};

export function A11y() {
  let ref = useRef<HTMLDivElement>(null);
  let fingerRef = useRef<HTMLDivElement>(null);
  let [cursorRect, setCursorRect] = useState<Rect | null>(null);
  let [fingerPos, setFingerPos] = useState<Point | null>(null);
  let [isOpen, setOpen] = useState(false);
  let [caption, setCaption] = useState('');
  let [selectedKey, setSelectedKey] = useState<Key>('read');
  useIntersectionObserver(ref, () => {
    let button: HTMLButtonElement | null = null;
    let listbox: HTMLElement | null = null;
    const swipeRight = {
      time: 500,
      perform() {
        fingerRef.current.animate(swipeRightKeyframes, {duration: 500});
      }
    };

    const doubleTap = {
      time: 800,
      perform() {
        fingerRef.current.animate(doubleTapKeyframes, {duration: 500});
      }
    };

    let rect = getRect(ref.current);
    flushSync(() => {
      setFingerPos({
        top: rect.top + rect.height - 170,
        left: rect.left + rect.width / 2 - 20
      });
    });

    let cancel = animate([
      swipeRight,
      {
        time: 1000,
        perform() {
          let label = ref.current.querySelector('span');
          setCursorRect(getRect(label, 5));
          setCaption('Permissions');
        }
      },
      swipeRight,
      {
        time: 2000,
        perform() {
          button = ref.current.querySelector('button');
          setCursorRect(getRect(button));
          setCaption('Read Only Permissions, Pop up button, List box popup, Double tap to activate the picker');
        }
      },
      doubleTap,
      {
        time: 180,
        perform() {
          setOpen(true);
        }
      },
      {
        time: 1500,
        perform() {
          listbox = document.getElementById(button!.getAttribute('aria-controls'));
          let option = listbox.querySelector('[role=option]');
          setCursorRect(getRect(option));
          setCaption('Permissions, Read Only, List start');
        }
      },
      swipeRight,
      {
        time: 1000,
        perform() {
          let option = listbox.querySelectorAll('[role=option]')[1];
          setCursorRect(getRect(option));
          setCaption('Edit');
        }
      },
      swipeRight,
      {
        time: 1500,
        perform() {
          let option = listbox.querySelectorAll('[role=option]')[2];
          setCursorRect(getRect(option));
          setCaption('Admin, List end');
        }
      },
      swipeRight,
      {
        time: 1500,
        perform() {
          let option = listbox.parentElement.querySelector('button');
          setCursorRect(getRect(option));
          setCaption('Dismiss, button');
        }
      },
      doubleTap,
      {
        time: 2000,
        perform() {
          setOpen(false);
          setCursorRect(getRect(button));
          setCaption('Read Only Permissions, Pop up button, List box popup, Double tap to activate the picker');
        }
      },
      {
        time: 800,
        perform() {
          setCursorRect(null);
          setCaption('');
        }
      }
    ]);

    return () => {
      cancel();
      setOpen(false);
      setCursorRect(null);
      setCaption('');
    };
  });

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-1 px-6 py-3 text-xs font-medium text-black border-b bg-gray-100">
        <Clock />
        <span className="flex-1" />
        <WifiIcon className="w-3 h-3" />
        <svg viewBox="0 0 28 24" className="h-5 stroke-gray-600" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="10" x="2" y="7" rx="3" ry="3" />
          <rect width="13" height="7" x="3.5" y="8.5" rx="2" ry="2" fill="black" stroke="none" />
          <line x1="25" x2="25" y1="11" y2="13" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex-1 flex justify-center pt-28 md:pt-40 pb-40 relative" ref={ref}>
        {fingerPos && createPortal(<div ref={fingerRef} className="pointer-events-none absolute w-10 h-10 rounded-full border border-black/80 bg-black/80 opacity-0" style={{...fingerPos, zIndex: 100000000}} />, document.body)}
        {cursorRect && createPortal((
          <div
            className="rounded-md border-2 border-black absolute"
            style={{
              ...cursorRect,
              zIndex: 100000000,
              boxShadow: '0 0 0 1px white, inset 0 0 0 1px white',
              minWidth: 10,
              minHeight: 10
            }} />
        ), document.body)}
        <Select className="group flex flex-col gap-1" selectedKey={selectedKey} onSelectionChange={cursorRect ? null : setSelectedKey} isOpen={isOpen} onOpenChange={cursorRect ? null : setOpen}>
          <Label>Permissions</Label>
          <Button className="flex items-center text-start gap-4 w-full cursor-default border border-gray-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-lg pl-3 pr-2 py-2 min-w-[150px] transition bg-gray-50 hover:bg-gray-100 pressed:bg-gray-200 group-invalid:border-red-600 disabled:text-gray-200 outline-none focus-visible:outline-blue-600 outline-offset-2">
            <SelectValue className="flex-1 text-sm text-gray-800 placeholder-shown:italic" />
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </Button>
          <Popover isNonModal={!!cursorRect} className="min-w-[--trigger-width]">
            <ListBox className="outline-none p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]">
              <SelectItem id="read">Read Only</SelectItem>
              <SelectItem id="edit">Edit</SelectItem>
              <SelectItem id="admin">Admin</SelectItem>
            </ListBox>
          </Popover>
        </Select>
      </div>
      {caption && <div className="absolute bottom-4 md:bottom-8 left-8 right-8 bg-gray-700 text-white text-center text-xs px-2 py-1.5 rounded-lg">{caption}</div>}
    </div>
  );
}

function Clock() {
  let formatter = useDateFormatter({
    timeStyle: 'short'
  });

  let [time, setTime] = useState(() => new Date());

  useEffect(() => {
    let nextMinute = Math.floor((Date.now() + 60000) / 60000) * 60000;
    let timeout = setTimeout(() => {
      setTime(new Date());
    }, nextMinute - Date.now());

    return () => clearTimeout(timeout);
  });

  return (
    <span className="text-xs font-semibold">
      {formatter.format(time)}
    </span>
  );
}

function getRect(element: Element | null, px = 0) {
  if (!element) {
    return {top: 0, left: 0, width: 0, height: 0};
  }

  let rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX - px,
    width: rect.width + px * 2,
    height: rect.height
  };
}
