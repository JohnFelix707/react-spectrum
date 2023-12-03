import {GridList, GridListItem, Text, Button, DropIndicator, isTextDropItem, useDragAndDrop} from 'react-aria-components';
import {useListData} from 'react-stately';
import React from 'react';

const tickets = [
  {
    "title": "UI Button Alignment Issue",
    "description": "Buttons in the Settings menu are misaligned on smaller screens.",
    "id": "#101",
    "assignee": "Gilberto Miguel",
    "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-15",
    "status": "Open"
  },
  {
    "title": "Login Page Redesign",
    "description": "Requesting a redesign of the login page to improve user experience.",
    "id": "#102",
    "assignee": "Maia Pettegree",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-16",
    "status": "Open"
  },
  {
    "title": "Database Connection Error",
    "description": "Users are experiencing intermittent connection errors when accessing the database.",
    "id": "#103",
    "assignee": "Mike Johnson",
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-17",
    "status": "In Progress"
  },
  {
    "title": "Feature: Dark Mode",
    "description": "Implement a dark mode option for improved accessibility and user preference.",
    "id": "#104",
    "assignee": "Sarah Lee",
    "avatar": "https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-18",
    "status": "Open"
  },
  {
    "title": "Missing User Profile Pictures",
    "description": "Some user profile pictures are not displaying properly in the user dashboard.",
    "id": "#105",
    "assignee": "David Chen",
    "avatar": "https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-19",
    "status": "Open"
  },
  {
    "title": "Performance Optimization",
    "description": "Requesting performance optimization for the application to reduce load times.",
    "id": "#106",
    "assignee": "Sarah Lee",
    "avatar": "https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-20",
    "status": "Closed"
  },
  {
    "title": "Broken Link on Homepage",
    "description": "The \"Learn More\" link on the homepage is leading to a 404 error.",
    "id": "#107",
    "assignee": "Alex Turner",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-21",
    "status": "Open"
  },
  {
    "title": "Feature: Export to PDF",
    "description": "Implement a feature to allow users to export their data to PDF format.",
    "id": "#108",
    "assignee": "Maia Pettegree",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-22",
    "status": "Open"
  },
  {
    "title": "Mobile Responsiveness Issue",
    "description": "The application is not rendering properly on certain mobile devices.",
    "id": "#109",
    "assignee": "Kevin Williams",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
    "date": "2023-09-23",
    "status": "Open"
  },
  {
    "title": "Feature: Two-Factor Authentication",
    "description": "Requesting the addition of two-factor authentication for improved security.",
    "id": "#110",
    "assignee": "Maia Pettegree",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "date": "2023-09-24",
    "status": "In Progress"
  }
];

export function KanbanBoard() {
  let list = useListData({
    initialItems: tickets
  });

  return (
    <div className="flex justify-center gap-4">
      <Column status="Open" list={list} itemClassName="selected:bg-green-100 selected:border-green-500" />
      <Column status="In Progress" list={list} itemClassName="selected:bg-blue-100 selected:border-blue-500" />
      <Column status="Closed" list={list} itemClassName="selected:bg-red-100 selected:border-red-500" />
    </div>
  );
}

function Column({list, status, itemClassName}) {
  let items = list.items.filter(t => t.status === status);

  let { dragAndDropHooks } = useDragAndDrop({
    // Provide drag data in a custom format as well as plain text.
    getItems(keys) {
      return [...keys].map((id) => ({
        'issue-id': id,
        'text/plain': list.getItem(id).title
      }));
    },

    renderDropIndicator(target) {
      return (
        <DropIndicator target={target} className="-my-[11px] -mx-[8px] invisible drop-target:visible">
          <svg height={10} className="w-full">
            <circle cx={5} cy={5} r={5-1} strokeWidth={2} className="stroke-blue-500 fill-none" />
            <line x1={20} x2="100%" transform="translate(-10 0)" y1={5} y2={5} strokeWidth={2} className="stroke-blue-500" />
            <circle cx="100%" cy={5} r={5-1} transform="translate(-5 0)" strokeWidth={2} className="stroke-blue-500 fill-none" />
          </svg>
        </DropIndicator>
      )
    },

    // Accept drops with the custom format.
    acceptedDragTypes: ['issue-id'],

    // Ensure items are always moved rather than copied.
    getDropOperation: () => 'move',

    // Handle drops between items from other lists.
    async onInsert(e) {
      let ids = await Promise.all(
        e.items.filter(isTextDropItem).map(item => item.getText('issue-id'))
      );
      for (let id of ids) {
        list.update(id, {...list.getItem(id), status });
      }
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, ids);
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, ids);
      }
    },

    // Handle drops on the collection when empty.
    async onRootDrop(e) {
      let ids = await Promise.all(
        e.items.filter(isTextDropItem).map(item => item.getText('issue-id'))
      );
      for (let id of ids) {
        list.update(id, {...list.getItem(id), status });
      }
    },

    // Handle reordering items within the same list.
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys);
      }
    }
  });

  return (
    <section className="flex flex-col gap-2">
      <header>
        <h3 className="font-semibold text-white my-0">{status}</h3>
        <span className="text-sm text-white">{items.length} {items.length === 1 ? 'task' : 'tasks'}</span>
      </header>
      <GridList
        items={items}
        aria-label={status}
        selectionMode="multiple"
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => 'No tasks.'}
        className="flex-1 w-70 max-h-[320px] p-4 overflow-y-auto overflow-x-hidden outline-none bg-white/70 backdrop-blur border border-black/10 bg-clip-padding text-gray-700 flex flex-col gap-3 rounded-xl shadow-xl drop-target:bg-blue-200 drop-target:ring-2 empty:items-center empty:justify-center ring-inset ring-blue-500">
        {item => <Card item={item} className={itemClassName} />}
      </GridList>
    </section>
  );
}

function Card({id, item, className}) {
  return (
    <GridListItem id={id} textValue={item.title} className={`group grid grid-cols-[1fr_auto] gap-1 [&>*]:contents p-2 rounded-lg border border-solid border-black/10 hover:border-black/20 bg-white/80 bg-clip-padding hover:shadow-md selected:shadow-md dragging:opacity-50 transition text-slate-700 cursor-default select-none outline-none outline-offset-2 focus-visible:outline-blue-500 ${className}`}>
      <span className="font-bold truncate">{item.title}</span>
      <span className="text-sm justify-self-end">{item.id}</span>
      <Text slot="description" className="text-sm line-clamp-2 col-span-2 text-slate-500">{item.description}</Text>
      <span className="flex items-center gap-1">
        <img src={item.avatar} alt="" className="h-4 w-4 rounded-full" />
        <span className="text-sm">{item.assignee}</span>
      </span>
      <Button slot="drag" className="bg-transparent border-none text-gray-500 text-base leading-none w-fit aspect-square p-0 justify-self-end outline-none focus-visible:ring-2 ring-blue-500 rounded-sm sr-only group-focus-visible:not-sr-only focus:not-sr-only">≡</Button>
    </GridListItem>
  );
}
