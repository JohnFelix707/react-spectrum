/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {action} from '@storybook/addon-actions';
import {Collection, CollectionRenderer, CollectionRendererContext} from '../src/Collection';
import {Header, ListBox, ListBoxItem, ListBoxProps, Section, Separator, Text, useDragAndDrop} from 'react-aria-components';
import {ListLayout} from '@react-stately/layout';
import {MyListBoxItem} from './utils';
import React, {useContext, useMemo} from 'react';
import styles from '../example/index.css';
import {useListData} from 'react-stately';
import {Virtualizer, VirtualizerContext} from '@react-aria/virtualizer';

export default {
  title: 'React Aria Components'
};

export const ListBoxExample = (args) => (
  <ListBox className={styles.menu} {...args} aria-label="test listbox">
    <MyListBoxItem>Foo</MyListBoxItem>
    <MyListBoxItem>Bar</MyListBoxItem>
    <MyListBoxItem>Baz</MyListBoxItem>
    <MyListBoxItem href="http://google.com">Google</MyListBoxItem>
  </ListBox>
);

ListBoxExample.story = {
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle',
    shouldFocusOnHover: false
  },
  argTypes: {
    selectionMode: {
      control: {
        type: 'radio',
        options: ['none', 'single', 'multiple']
      }
    },
    selectionBehavior: {
      control: {
        type: 'radio',
        options: ['toggle', 'replace']
      }
    }
  },
  parameters: {
    description: {
      data: 'Hover styles should have higher specificity than focus style for testing purposes. Hover style should not be applied on keyboard focus even if shouldFocusOnHover is true'
    }
  }
};

// Known accessibility false positive: https://github.com/adobe/react-spectrum/wiki/Known-accessibility-false-positives#listbox
// also has a aXe landmark error, not sure what it means
export const ListBoxSections = () => (
  <ListBox className={styles.menu} selectionMode="multiple" selectionBehavior="replace" aria-label="test listbox with section">
    <Section className={styles.group}>
      <Header style={{fontSize: '1.2em'}}>Section 1</Header>
      <MyListBoxItem>Foo</MyListBoxItem>
      <MyListBoxItem>Bar</MyListBoxItem>
      <MyListBoxItem>Baz</MyListBoxItem>
    </Section>
    <Separator style={{borderTop: '1px solid gray', margin: '2px 5px'}} />
    <Section className={styles.group} aria-label="Section 2">
      <MyListBoxItem>Foo</MyListBoxItem>
      <MyListBoxItem>Bar</MyListBoxItem>
      <MyListBoxItem>Baz</MyListBoxItem>
    </Section>
  </ListBox>
);

export const ListBoxComplex = () => (
  <ListBox className={styles.menu} selectionMode="multiple" selectionBehavior="replace" aria-label="listbox complex">
    <MyListBoxItem>
      <Text slot="label">Item 1</Text>
      <Text slot="description">Description</Text>
    </MyListBoxItem>
    <MyListBoxItem>
      <Text slot="label">Item 2</Text>
      <Text slot="description">Description</Text>
    </MyListBoxItem>
    <MyListBoxItem>
      <Text slot="label">Item 3</Text>
      <Text slot="description">Description</Text>
    </MyListBoxItem>
  </ListBox>
);


let albums = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1593958812614-2db6a598c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlzY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Euphoric Echoes',
    artist: 'Luna Solstice'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmVvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Neon Dreamscape',
    artist: 'Electra Skyline'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNwYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60',
    title: 'Cosmic Serenade',
    artist: 'Orion\'s Symphony'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Melancholy Melodies',
    artist: 'Violet Mistral'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1608433319511-dfe8ea4cbd3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJlYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Rhythmic Illusions',
    artist: 'Mirage Beats'
  }
];

export const ListBoxDnd = (props: ListBoxProps<typeof albums[0]>) => {
  let list = useListData({
    initialItems: albums
  });

  let {dragAndDropHooks} = useDragAndDrop({
    getItems: (keys) => [...keys].map(key => ({'text/plain': list.getItem(key).title})),
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys);
      }
    }
  });

  return (
    <ListBox
      {...props}
      aria-label="Albums"
      items={list.items}
      selectionMode="multiple"
      dragAndDropHooks={dragAndDropHooks}>
      {item => (
        <ListBoxItem>
          <img src={item.image} alt="" />
          <Text slot="label">{item.title}</Text>
          <Text slot="description">{item.artist}</Text>
        </ListBoxItem>
      )}
    </ListBox>
  );
};

ListBoxDnd.story = {
  args: {
    layout: 'stack',
    orientation: 'horizontal'
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['stack', 'grid']
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    }
  }
};

export const ListBoxHover = () => (
  <ListBox className={styles.menu} aria-label="test listbox" onAction={action('onAction')} >
    <MyListBoxItem onHoverStart={action('onHoverStart')} onHoverChange={action('onHoverChange')} onHoverEnd={action('onHoverEnd')}>Hover</MyListBoxItem>
    <MyListBoxItem>Bar</MyListBoxItem>
    <MyListBoxItem>Baz</MyListBoxItem>
    <MyListBoxItem href="http://google.com">Google</MyListBoxItem>
  </ListBox>
);

export const ListBoxGrid = (args) => (
  <ListBox
    {...args}
    className={styles.menu} 
    aria-label="test listbox"
    style={{
      width: 300,
      height: 300,
      display: 'grid',
      gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
      gridAutoFlow: args.orientation === 'vertical' ? 'row' : 'column'
    }}>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1,1</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1,2</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1,3</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>2,1</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>2,2</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>2,3</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>3,1</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>3,2</MyListBoxItem>
    <MyListBoxItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>3,3</MyListBoxItem>
  </ListBox>
);

ListBoxGrid.story = {
  args: {
    layout: 'grid',
    orientation: 'vertical'
  },
  argTypes: {
    orientation: {
      control: {
        type: 'radio',
        options: ['vertical', 'horizontal']
      }
    }
  }
};

export function VirtualizedListBox() {
  let sections: {id: string, name: string, children: {id: string, name: string}[]}[] = [];
  for (let s = 0; s < 10; s++) {
    let items: {id: string, name: string}[] = [];
    for (let i = 0; i < 100; i++) {
      items.push({id: `item_${s}_${i}`, name: `Item ${i}`});
    }
    sections.push({id: `section_${s}`, name: `Section ${s}`, children: items});
  }
  return (
    <VirtualizedCollection>
      <ListBox className={styles.menu} style={{height: 400}} aria-label="virtualized listbox" items={sections}>
        {section => (
          <Section className={styles.group}>
            <Header style={{fontSize: '1.2em'}}>{section.name}</Header>
            <Collection items={section.children}>
              {item => <MyListBoxItem>{item.name}</MyListBoxItem>}
            </Collection>
          </Section>
        )}
      </ListBox>
    </VirtualizedCollection>
  );
}

function VirtualizedCollection({children}) {
  return (
    <CollectionRendererContext.Provider value={VirtualizedCollectionRenderer}>
      {children}
    </CollectionRendererContext.Provider>
  );
}

const VirtualizedCollectionRenderer: CollectionRenderer = (collection, parent) => {
  if (parent) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let virtualizer = useContext(VirtualizerContext)!;
    return virtualizer.virtualizer.getChildren(parent.key);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  let layout = useMemo(() => {
    return new ListLayout({
      estimatedRowHeight: 32,
      estimatedHeadingHeight: 26,
      padding: 4,
      loaderHeight: 40,
      placeholderHeight: 32
      // collator
    });
  }, []);

  return (
    <Virtualizer
      sizeToFit="height"
      scrollDirection="vertical"
      layout={layout}
      style={{height: 'inherit'}}
      collection={collection}
      shouldUseVirtualFocus>
      {(type, item) => {
        switch (type) {
          case 'placeholder':
            return null;
          default:
            return item.render!(item);
        }
      }}
    </Virtualizer>
  );
};
