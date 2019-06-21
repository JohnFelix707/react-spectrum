import {action} from '@storybook/addon-actions';
import {Button, ButtonProps} from '../src';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('Button', module)
  .add(
    'variant: cta',
    () => render({variant: 'cta'})
  )
  .add(
    'variant: overBackground',
    () => (
      <div style={{backgroundColor: 'rgb(15, 121, 125)', color: 'rgb(15, 121, 125)', padding: '15px 20px', display: 'inline-block'}}>
        {render({variant: 'overBackground'})}
      </div>
    )
  )
  .add(
    'variant: primary',
    () => render({variant: 'primary'})
  )
  .add(
    'variant: secondary',
    () => render({variant: 'secondary'})
  )
  .add(
    'variant: negative',
    () => render({variant: 'negative'})
  )
  .add(
    'element: a',
    () => render({elementType: 'a', href: 'http://example.com'})
  );

function render(props:ButtonProps = {}) {
  return (
    <div>
      <Button
        onPress={action('press')}
        {...props}>
        Default
      </Button>
      <Button
        onPress={action('press')}
        isDisabled
        {...props}>
        Disabled
      </Button>
      {props.variant !== 'cta' && (
      <Button
        onPress={action('press')}
        isQuiet
        {...props}>
        Quiet
      </Button>
      )}
    </div>
  );
}
