import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagGroupProps as AriaTagGroupProps,
  TagList,
  TagListProps,
  TagProps,
  composeRenderProps,
  Provider,
  TextContext
} from 'react-aria-components';
import {field, focusRing} from './style-utils' with {type: 'macro'};
import {FieldLabel, HelpText} from './Field';
import {FormContext, useFormProps} from './Form';
import {SpectrumLabelableProps} from '@react-types/shared';
import {ClearButton} from './ClearButton';
import {style} from '../style-macro/spectrum-theme' with { type: 'macro' };
import {pressScale} from './pressScale';
import {createContext, useContext, useRef} from 'react';


// Get types from RSP and extend those?

interface RSPTagProps extends TagProps {}


export interface TagGroupProps<T>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'>,
    SpectrumLabelableProps {
  label?: string,
  description?: string,
  errorMessage?: string,
  size?: 'S' | 'M' | 'L',
  isEmphasized?: boolean
}

const TagGroupContext = createContext<TagGroupProps<any>>({});

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    labelPosition = 'top',
    labelAlign = 'start',
    isRequired,
    children,
    renderEmptyState,
    isEmphasized,
    ...props
  }: TagGroupProps<T>
) {
  let formContext = useContext(FormContext);
  props = useFormProps(props);
  let {size = 'M'} = props;

  // TODO collapse behavior, need a custom collection render so we can limit the number of children
  // but this isn't possible yet
  return (
    <AriaTagGroup
      {...props}
      className={style({
        ...field(),
        '--field-gap': {
          type: 'rowGap',
          value: '[calc(var(--field-height) - 1lh)]'
        }
      })({
        size: props.size,
        labelPosition: labelPosition,
        isInForm: !!formContext
      })}>
      <FieldLabel
        size={size}
        isRequired={isRequired}
        labelPosition={labelPosition}
        labelAlign={labelAlign}
        necessityIndicator={props.necessityIndicator}>
        {label}
      </FieldLabel>
      <div
        className={style({
          gridArea: 'input',
          display: 'flex',
          flexWrap: 'wrap',
            // Spectrum uses a fixed spacing value for horizontal (column),
            // but the gap changes depending on t-shirt size in vertical (row).
          columnGap: 4,
          rowGap: '--field-gap'
        })()}>
        <FormContext.Provider value={{...formContext, size}}>
          <Provider
            values={[
                [TextContext, undefined],
                [TagGroupContext, {size, isEmphasized}]
            ]}>
            <TagList
              items={items}
              renderEmptyState={renderEmptyState}
              className={({isEmpty}) => style({
                marginX: {
                  default: '-1', // use negative number when theme TS is ready
                  isEmpty: 0
                }
              })({isEmpty})}>
              {children}
            </TagList>
          </Provider>
        </FormContext.Provider>
      </div>
      <HelpText
        size={size}
        description={description}>
        {errorMessage}
      </HelpText>
    </AriaTagGroup>
  );
}

const tagStyles = style({
  ...focusRing(),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans',
  fontWeight: 'medium',
  fontSize: 'control',
  height: 'control',
  transition: 'default',
  backgroundColor: {
    default: 'gray-100',
    isSelected: {
      default: 'neutral',
      isEmphasized: 'accent'
    },
    isDisabled: 'disabled',
    forcedColors: {
      default: 'ButtonFace',
      isSelected: 'Highlight'
    }
  },
  color: {
    default: 'neutral',
    isSelected: {
      default: 'gray-25',
      isEmphasized: {
        default: 'gray-25',
        dark: 'gray-1000'
      }
    },
    isDisabled: 'disabled',
    forcedColors: {
      default: 'ButtonText',
      isSelected: 'HighlightText',
      isDisabled: 'GrayText'
    }
  },
  borderStyle: 'none',
  paddingStart: {
    default: 'edge-to-text'
  },
  paddingEnd: {
    default: 'edge-to-text',
    allowsRemoving: 0
  },
  paddingY: 0,
  margin: 1,
  borderRadius: 'control',
  cursor: 'default',
  '--iconMargin': {
    type: 'marginTop',
    value: {
      default: '[calc(-2 / 14 * 1em)]'
    }
  }
});

export function Tag({children, ...props}: RSPTagProps) {
  let textValue = typeof children === 'string' ? children : undefined;
  let {size = 'M', isEmphasized} = useContext(TagGroupContext);
  let ref = useRef(null);
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      ref={ref}
      style={pressScale(ref)}
      className={renderProps => tagStyles({...renderProps, size, isEmphasized})} >
      {composeRenderProps(children, (children, {allowsRemoving, isDisabled}) => (
        <>
          <div
            className={style({
              display: 'flex',
              alignItems: 'center',
              gap: 'text-to-visual',
              forcedColorAdjust: 'none',
              backgroundColor: 'transparent'
            })()}>
            {children}
          </div>
          {allowsRemoving && (
            <ClearButton
              slot="remove"
              size={size}
              isDisabled={isDisabled} />
          )}
        </>
      ))}
    </AriaTag>
  );
}
