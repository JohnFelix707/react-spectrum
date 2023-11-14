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

import {
  classNames,
  SlotProvider,
  useFocusableRef,
  useHasChild,
  useSlotProps,
  useStyleProps
} from '@react-spectrum/utils';
import {FocusableRef} from '@react-types/shared';
import {FocusRing} from '@react-aria/focus';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {mergeProps, useId} from '@react-aria/utils';
import {ProgressCircle} from '@react-spectrum/progress';
import React, {ElementType, ReactElement, useEffect, useState} from 'react';
import {SpectrumButtonProps} from '@react-types/button';
import styles from '@adobe/spectrum-css-temp/components/button/vars.css';
import {Text} from '@react-spectrum/text';
import {useButton} from '@react-aria/button';
import {useHover} from '@react-aria/interactions';
import {useLocalizedStringFormatter} from '@react-aria/i18n';
import {useProviderProps} from '@react-spectrum/provider';

function disablePendingProps(props) {
  // Don't allow interaction while isPending is true
  if (props.isPending) {
    props.onPress = undefined;
    props.onPressStart = undefined;
    props.onPressEnd = undefined;
    props.onPressChange = undefined;
    props.onPressUp = undefined;
    props.onKeyDown = undefined;
    props.onKeyUp = undefined;
    props.onClick = undefined;
    props.href = undefined;
  }
  return props;
}

function Button<T extends ElementType = 'button'>(props: SpectrumButtonProps<T>, ref: FocusableRef<HTMLElement>) {
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');
  props = disablePendingProps(props);
  let {
    elementType: Element = 'button',
    children,
    variant,
    style = variant === 'accent' || variant === 'cta' ? 'fill' : 'outline',
    staticColor,
    isDisabled,
    isPending,
    autoFocus,
    ...otherProps
  } = props;
  let domRef = useFocusableRef(ref);
  let {buttonProps, isPressed} = useButton(props, domRef);
  let {hoverProps, isHovered} = useHover({isDisabled});
  let stringFormatter = useLocalizedStringFormatter(intlMessages);
  let {styleProps} = useStyleProps(otherProps);
  let hasLabel = useHasChild(`.${styles['spectrum-Button-label']}`, domRef);
  let hasIcon = useHasChild(`.${styles['spectrum-Icon']}`, domRef);
  // an aria label will block children and their labels from being read, this is undesirable for pending state
  let hasAriaLabel = !!buttonProps['aria-label'] || !!buttonProps['aria-labelledby'];
  let [isProgressVisible, setIsProgressVisible] = useState(false);
  let backupButtonId = useId();
  let buttonId = buttonProps.id || backupButtonId;
  let spinnerId = useId();
  let textId = useId();
  let iconId = useId();
  let auxLabelId = useId();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isPending) {
      // Start timer when isPending is set to true.
      timeout = setTimeout(() => {
        setIsProgressVisible(true);
      }, 1000);
    } else {
      // Exit loading state when isPending is set to false. */
      setIsProgressVisible(false);
    }
    return () => {
      // Clean up on unmount or when user removes isPending prop before entering loading state.
      clearTimeout(timeout);
    };
  }, [isPending]);

  if (variant === 'cta') {
    variant = 'accent';
  } else if (variant === 'overBackground') {
    variant = 'primary';
    staticColor = 'white';
  }

  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring')} autoFocus={autoFocus}>
      <Element
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        id={buttonId}
        ref={domRef}
        data-variant={variant}
        data-style={style}
        data-static-color={staticColor || undefined}
        aria-disabled={isPending ? 'true' : undefined}
        aria-label={isPending ? undefined : buttonProps['aria-label']}
        aria-labelledby={isPending ? undefined : buttonProps['aria-labelledby']}
        className={
          classNames(
            styles,
            'spectrum-Button',
            {
              'spectrum-Button--iconOnly': hasIcon && !hasLabel,
              'is-disabled': isDisabled || isProgressVisible,
              'is-active': isPressed,
              'is-hovered': isHovered,
              'spectrum-Button--pending': isProgressVisible
            },
            styleProps.className
          )
        }>
        <SlotProvider
          slots={{
            icon: {
              id: iconId,
              size: 'S',
              UNSAFE_className: classNames(styles, 'spectrum-Icon')
            },
            text: {
              id: textId,
              UNSAFE_className: classNames(styles, 'spectrum-Button-label')
            }
          }}>
          {typeof children === 'string'
            ? <Text>{children}</Text>
            : children}
          {isPending && <ProgressCircle
            aria-hidden="true"
            isIndeterminate
            size="S"
            UNSAFE_className={classNames(styles, 'spectrum-Button-circleLoader')}
            UNSAFE_style={{visibility: isProgressVisible ? 'visible' : 'hidden'}}
            staticColor={staticColor} />
          }
          {isPending && hasAriaLabel &&
            <div aria-hidden="true" id={auxLabelId} aria-label={buttonProps['aria-label']} aria-labelledby={buttonProps['aria-labelledby']?.replace(buttonId, auxLabelId)} />
          }
          {isPending && <div
            id={spinnerId}
            aria-label={stringFormatter.format('pending')}
            aria-labelledby={`${hasAriaLabel ? '' : iconId} ${hasAriaLabel ? auxLabelId : textId} ${spinnerId}`} />
          }
        </SlotProvider>
      </Element>
    </FocusRing>
  );
}

/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention to
 * where a user needs to do something in order to move forward in a flow.
 */
let _Button = React.forwardRef(Button) as <T extends ElementType = 'button'>(props: SpectrumButtonProps<T> & {ref?: FocusableRef<HTMLElement>}) => ReactElement;
export {_Button as Button};
