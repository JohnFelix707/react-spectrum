import type {Meta} from '@storybook/react';
import {Dialog, DialogTrigger, DialogContainer, Button, ButtonGroup, Checkbox, Content, Footer, Heading, Header, Image, Provider} from '../src';
import {useState} from 'react';
import {style} from '../style/spectrum-theme' with {type: 'macro'};

const meta: Meta<typeof Dialog> = {
  component: Dialog as any,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {exclude: ['showHero', 'showHeading', 'showHeader', 'showFooter', 'showButtons', 'paragraphs', 'title']}
    }
  },
  argTypes: {
    // @ts-ignore
    type: {
      control: 'radio',
      options: ['modal', 'fullscreen', 'fullscreenTakeover']
    }
  },
  tags: ['autodocs']
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="primary">Open dialog</Button>
    <Dialog {...args}>
      {({close}) => (
        <>
          <Image slot="hero" src="https://i.imgur.com/Z7AzH2c.png" alt="Sky over roof" />
          <Heading slot="title">{args.title}</Heading>
          <Header>Header</Header>
          <Content>
            {[...Array(args.paragraphs)].map((_, i) =>
              <p key={i} style={{marginTop: i === 0 ? 0 : undefined, marginBottom: i === args.paragraphs - 1 ? 0 : undefined}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in</p>
            )}
          </Content>
          <Footer><Checkbox>Don't show this again</Checkbox></Footer>
          <ButtonGroup>
            <Button onPress={close} variant="secondary">Cancel</Button>
            <Button onPress={close} variant="accent">Save</Button>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  </DialogTrigger>
);
Example.parameters = {
  docs: {
    source: {
      transform: () => {
        return `<DialogTrigger>
  <Button variant="primary">Open dialog</Button>
  <Dialog>
    {({close}) => (
      <>
        <Image slot="hero" src="https://i.imgur.com/Z7AzH2c.png" alt="Sky over roof" />
        <Heading slot="title">Dialog title</Heading>
        <Header>Header</Header>
        <Content>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in</p>
        </Content>
        <Footer><Checkbox>Don't show this again</Checkbox></Footer>
        <ButtonGroup>
          <Button onPress={close} variant="secondary">Cancel</Button>
          <Button onPress={close} variant="accent">Save</Button>
        </ButtonGroup>
      </>
    )}
  </Dialog>
</DialogTrigger>`;
      }
    }
  }
};

export const DialogTriggerExample = (args: any) => (
  <DialogTrigger {...args}>
    <Button variant="primary">Open dialog</Button>
    <ExampleDialog {...args} />
  </DialogTrigger>
);

DialogTriggerExample.args = {
  showHero: true,
  showHeading: true,
  showHeader: true,
  showFooter: true,
  showButtons: true,
  paragraphs: 1,
  title: 'Dialog title'
};
DialogTriggerExample.parameters = {
  docs: {
    disable: true
  }
};

function ExampleDialog(args: any) {
  return (
    <Dialog {...args}>
      {({close}) => (
        <>
          {args.showHero && <Image slot="hero" src="https://i.imgur.com/Z7AzH2c.png" alt="Sky over roof" />}
          {args.showHeading && <Heading slot="title">{args.title}</Heading>}
          {args.showHeader && <Header>Header</Header>}
          <Content>
            {[...Array(args.paragraphs)].map((_, i) =>
              <p key={i} style={{marginTop: i === 0 ? 0 : undefined, marginBottom: i === args.paragraphs - 1 ? 0 : undefined}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in</p>
            )}
          </Content>
          {args.showFooter && <Footer><Checkbox>Don't show this again</Checkbox></Footer>}
          {args.showButtons &&
            <ButtonGroup>
              <Button onPress={close} variant="secondary">Cancel</Button>
              <Button onPress={close} variant="accent">Save</Button>
            </ButtonGroup>
          }
        </>
      )}
    </Dialog>
  );
}

export function DialogContainerExample(props: any) {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button variant="accent" onPress={() => setOpen(true)}>Open dialog</Button>
      <DialogContainer onDismiss={() => setOpen(false)} {...props}>
        {isOpen &&
          <ExampleDialog {...props} />
        }
      </DialogContainer>
    </>
  );
}

DialogContainerExample.args = DialogTriggerExample.args;
DialogContainerExample.parameters = {
  docs: {
    source: {
      transform: () => {
        return `<>
  <Button variant="accent" onPress={() => setOpen(true)}>Open dialog</Button>
  <DialogContainer onDismiss={() => setOpen(false)}>
    {isOpen &&
      <Dialog>
        {({close}) => (
          <>
            <Image slot="hero" src="https://i.imgur.com/Z7AzH2c.png" alt="Sky over roof" />
            <Heading slot="title">Dialog title</Heading>
            <Header>Header</Header>
            <Content>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in</p>
            </Content>
            <Footer><Checkbox>Don't show this again</Checkbox></Footer>
            <ButtonGroup>
              <Button onPress={close} variant="secondary">Cancel</Button>
              <Button onPress={close} variant="accent">Save</Button>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    }
  </DialogContainer>
</>`;
      }
    }
  }
};

export const ColorScheme = (args: any) => (
  <Provider colorScheme="dark" background="base" styles={style({padding: 48})}>
    <DialogTriggerExample {...args} />
  </Provider>
);

ColorScheme.args = DialogTriggerExample.args;
ColorScheme.parameters = {
  docs: {
    disable: true
  }
};
