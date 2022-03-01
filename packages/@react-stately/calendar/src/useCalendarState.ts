/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {alignCenter, alignEnd, alignStart, constrainStart, constrainValue, isInvalid} from './utils';
import {
  Calendar,
  CalendarDate,
  DateDuration,
  GregorianCalendar,
  isSameDay,
  toCalendar,
  toCalendarDate,
  today
} from '@internationalized/date';
import {CalendarProps, DateValue} from '@react-types/calendar';
import {CalendarState} from './types';
import {useControlledState} from '@react-stately/utils';
import {useDateFormatter} from '@react-aria/i18n';
import {useEffect, useMemo, useRef, useState} from 'react';

interface CalendarStateOptions<T extends DateValue> extends CalendarProps<T> {
  locale: string,
  createCalendar: (name: string) => Calendar,
  visibleDuration?: DateDuration,
  selectionAlignment?: 'start' | 'center' | 'end'
}

export function useCalendarState<T extends DateValue>(props: CalendarStateOptions<T>): CalendarState {
  let defaultFormatter = useDateFormatter();
  let resolvedOptions = useMemo(() => defaultFormatter.resolvedOptions(), [defaultFormatter]);
  let {
    locale,
    createCalendar,
    visibleDuration = {months: 1},
    minValue,
    maxValue,
    selectionAlignment
  } = props;

  let calendar = useMemo(() => createCalendar(resolvedOptions.calendar), [createCalendar, resolvedOptions.calendar]);

  let [value, setControlledValue] = useControlledState<DateValue>(props.value, props.defaultValue, props.onChange);
  let calendarDateValue = useMemo(() => value ? toCalendar(toCalendarDate(value), calendar) : null, [value, calendar]);
  let timeZone = useMemo(() => value && 'timeZone' in value ? value.timeZone : resolvedOptions.timeZone, [value, resolvedOptions.timeZone]);
  let focusedCalendarDate = useMemo(() => (
    props.focusedValue
      ? constrainValue(toCalendar(toCalendarDate(props.focusedValue), calendar), minValue, maxValue)
      : undefined
  ), [props.focusedValue, calendar, minValue, maxValue]);
  let defaultFocusedCalendarDate = useMemo(() => (
    constrainValue(
      props.defaultFocusedValue
        ? toCalendar(toCalendarDate(props.defaultFocusedValue), calendar)
        : calendarDateValue || toCalendar(today(timeZone), calendar),
      minValue,
      maxValue
    )
  ), [props.defaultFocusedValue, calendarDateValue, timeZone, calendar, minValue, maxValue]);
  let [focusedDate, setFocusedDate] = useControlledState(focusedCalendarDate, defaultFocusedCalendarDate, props.onFocusChange);
  let [startDate, setStartDate] = useState(() => {
    switch (selectionAlignment) {
      case 'start':
        return alignStart(focusedDate, visibleDuration, locale, minValue, maxValue);
      case 'end':
        return alignEnd(focusedDate, visibleDuration, locale, minValue, maxValue);
      case 'center':
      default:
        return alignCenter(focusedDate, visibleDuration, locale, minValue, maxValue);
    }
  });
  let [isFocused, setFocused] = useState(props.autoFocus || false);

  let endDate = useMemo(() => startDate.add(visibleDuration).subtract({days: 1}), [startDate, visibleDuration]);

  // Reset focused date and visible range when calendar changes.
  let lastCalendarIdentifier = useRef(calendar.identifier);
  if (calendar.identifier !== lastCalendarIdentifier.current) {
    let newFocusedDate = toCalendar(focusedDate, calendar);
    setStartDate(alignCenter(newFocusedDate, visibleDuration, locale, minValue, maxValue));
    setFocusedDate(newFocusedDate);
    lastCalendarIdentifier.current = calendar.identifier;
  }

  if (focusedDate.compare(startDate) < 0) {
    setStartDate(alignEnd(focusedDate, visibleDuration, locale, minValue, maxValue));
  } else if (focusedDate.compare(startDate.add(visibleDuration)) >= 0) {
    setStartDate(alignStart(focusedDate, visibleDuration, locale, minValue, maxValue));
  }

  // Sets focus to a specific cell date
  function focusCell(date: CalendarDate) {
    date = constrainValue(date, minValue, maxValue);
    setFocusedDate(date);
  }

  function setValue(newValue: CalendarDate) {
    if (!props.isDisabled && !props.isReadOnly) {
      // The display calendar should not have any effect on the emitted value.
      // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
      newValue = toCalendar(newValue, value?.calendar || new GregorianCalendar());

      // Preserve time if the input value had one.
      if (value && 'hour' in value) {
        setControlledValue(value.set(newValue));
      } else {
        setControlledValue(newValue);
      }
    }
  }

  return {
    isDisabled: props.isDisabled,
    isReadOnly: props.isReadOnly,
    value: calendarDateValue,
    setValue,
    visibleRange: {
      start: startDate,
      end: endDate
    },
    focusedDate,
    timeZone,
    setFocusedDate(date) {
      focusCell(date);
      setFocused(true);
    },
    focusNextDay() {
      focusCell(focusedDate.add({days: 1}));
    },
    focusPreviousDay() {
      focusCell(focusedDate.subtract({days: 1}));
    },
    focusNextRow() {
      if (visibleDuration.days) {
        this.focusNextPage();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDate.add({weeks: 1}));
      }
    },
    focusPreviousRow() {
      if (visibleDuration.days) {
        this.focusPreviousPage();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDate.subtract({weeks: 1}));
      }
    },
    focusNextPage() {
      let start = startDate.add(visibleDuration);
      setStartDate(constrainStart(focusedDate, start, visibleDuration, locale, minValue, maxValue));
      setFocusedDate(constrainValue(focusedDate.add(visibleDuration), minValue, maxValue));
    },
    focusPreviousPage() {
      let start = startDate.subtract(visibleDuration);
      setStartDate(constrainStart(focusedDate, start, visibleDuration, locale, minValue, maxValue));
      setFocusedDate(constrainValue(focusedDate.subtract(visibleDuration), minValue, maxValue));
    },
    focusPageStart() {
      focusCell(startDate);
    },
    focusPageEnd() {
      focusCell(endDate);
    },
    focusNextSection() {
      if (visibleDuration.days) {
        this.focusNextPage();
      } else if (visibleDuration.weeks) {
        focusCell(focusedDate.add({months: 1}));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDate.add({years: 1}));
      }
    },
    focusPreviousSection() {
      if (visibleDuration.days) {
        this.focusPreviousPage();
      } else if (visibleDuration.weeks) {
        focusCell(focusedDate.subtract({months: 1}));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDate.subtract({years: 1}));
      }
    },
    selectFocusedDate() {
      setValue(focusedDate);
    },
    selectDate(date) {
      setValue(date);
    },
    isFocused,
    setFocused,
    isInvalid(date) {
      return isInvalid(date, minValue, maxValue);
    },
    isSelected(date) {
      return calendarDateValue != null && isSameDay(date, calendarDateValue) && !this.isCellDisabled(date);
    },
    isCellFocused(date) {
      return isFocused && focusedDate && isSameDay(date, focusedDate);
    },
    isCellDisabled(date) {
      return props.isDisabled || date.compare(startDate) < 0 || date.compare(endDate) > 0 || isInvalid(date, minValue, maxValue) || (props.isDateDisabled && props.isDateDisabled(date));
    },
    isPreviousVisibleRangeInvalid() {
      return isInvalid(startDate.subtract({days: 1}), minValue, maxValue);
    },
    isNextVisibleRangeInvalid() {
      return isInvalid(endDate.add({days: 1}), minValue, maxValue);
    }
  };
}
