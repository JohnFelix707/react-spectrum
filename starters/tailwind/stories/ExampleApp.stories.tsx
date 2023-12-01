import { useMemo, useState } from "react";
import { Select, SelectItem } from "../src/Select";
import { ColumnProps, Dialog, DialogTrigger, DropZone, Form, Heading, isFileDropItem, MenuTrigger, ResizableTableContainer, Selection, SortDescriptor, Table, TableBody, Text, ToggleButton, TooltipTrigger } from "react-aria-components";
import { Cell, Column, Row, TableHeader } from "../src/Table";
import { SearchField } from "../src/SearchField";
import { Button } from "../src/Button";
import { CloudSun, Dessert, Droplet, Droplets, FilterIcon, MoreHorizontal, PencilIcon, PlusIcon, RefreshCw, SlidersIcon, StarIcon, Sun, SunDim, TrashIcon } from "lucide-react";
import { Menu, MenuItem } from "../src/Menu";
import { Popover } from "../src/Popover";
import { DateRangePicker } from "../src/DateRangePicker";
import { Tooltip } from "../src/Tooltip";
import {useFilter, useCollator} from 'react-aria';
import { Checkbox } from "../src/Checkbox";
import plants from '../plants.json';
import { TagGroup, Tag } from "../src/TagGroup";
import { Modal } from "../src/Modal";
import { AlertDialog } from "../src/AlertDialog";
import { TextField } from "../src/TextField";

type Plant = typeof plants[0] & {isFavorite: boolean};

// const meta: Meta<typeof ExampleApp> = {
//   component: ExampleApp,
//   parameters: {
//     layout: 'centered'
//   },
//   tags: ['autodocs'],
// };

// export default meta;

const allColumns: ColumnProps[] = [
  {id: 'favorite', 'aria-label': 'Favorite', width: 40, minWidth: 40},
  {id: 'common_name', children: 'Name', minWidth: 150, allowsSorting: true},
  {id: 'cycle', children: 'Cycle', defaultWidth: 120, allowsSorting: true},
  {id: 'sunlight', children: 'Sunlight', defaultWidth: 120, allowsSorting: true},
  {id: 'watering', children: 'Watering', defaultWidth: 120, allowsSorting: true},
  {id: 'actions', 'aria-label': 'Actions', width: 44, minWidth: 44}
];

let hideOnScroll = document.getElementById('hideOnScroll');

export function ExampleApp() {
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'common_name',
    direction: 'ascending'
  });

  let [allItems, setAllItems] = useState(() => plants.map(p => ({...p, isFavorite: false})));
  let [search, setSearch] = useState('');
  let [favorite, setFavorite] = useState(false);
  let [cycles, setCycles] = useState<Selection>(new Set());
  let [sunlight, setSunlight] = useState<Selection>(new Set());
  let [watering, setWatering] = useState<Selection>(new Set());

  let {contains} = useFilter({sensitivity: 'base'});
  let collator = useCollator();
  let dir = sortDescriptor.direction === 'descending' ? -1 : 1;
  let items = allItems
    .filter(item =>
      (contains(item.common_name, search) || contains(item.scientific_name.join(''), search))
        && (!favorite || item.isFavorite)
        && (cycles === 'all' || cycles.size === 0 || cycles.has(item.cycle))
        && (sunlight === 'all' || sunlight.size === 0 || sunlight.has(getSunlight(item)))
        && (watering === 'all' || watering.size === 0 || watering.has(item.watering))
    )
    .sort((a, b) => collator.compare(a[sortDescriptor.column as any], b[sortDescriptor.column as any]) * dir);

  let [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(['favorite', 'common_name', 'sunlight', 'watering', 'actions']));
  let columns = useMemo(() => allColumns.filter(c => visibleColumns === 'all' || visibleColumns.has(c.id)), [visibleColumns]);
  columns[1].isRowHeader = true; // TODO

  let filters = 0;
  if (favorite) {
    filters++;
  }
  if (cycles !== 'all') {
    filters += cycles.size;
  }
  if (sunlight !== 'all') {
    filters += sunlight.size;
  }
  if (watering !== 'all') {
    filters += watering.size;
  }

  let clearFilters = () => {
    setFavorite(false);
    setCycles(new Set());
    setSunlight(new Set());
    setWatering(new Set());
  };

  let toggleFavorite = (id: number, isFavorite: boolean) => {
    setAllItems(allItems => {
      let items = [...allItems];
      let index = items.findIndex(item => item.id === id);
      items[index] = {...items[index], isFavorite};
      return items;
    });
  };

  let addItem = (item: Plant) => {
    setAllItems(allItems => [...allItems, item]);
  };

  let editItem = (item: Plant) => {
    setAllItems(allItems => {
      let items = [...allItems];
      let index = items.findIndex(i => i.id === item.id);
      items[index] = item;
      return items;
    });
  };

  let onScroll = (e) => {
    if (hideOnScroll) {
      if (e.target.scrollTop <= 0) {
        hideOnScroll.style.opacity = '1';
      } else {
        hideOnScroll.style.opacity = '0';
      }
    }
  };

  let [dialog, setDialog] = useState(null);
  let [actionItem, setActionItem] = useState(null);
  let onAction = (item: typeof items[0], action: string) => {
    switch (action) {
      case 'favorite':
        toggleFavorite(item.id, !item.isFavorite);
        break;
      default:
        setDialog(action);
        setActionItem(item);
        break;
    }
  };

  let onDialogClose = () => setDialog(null);

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex gap-2 items-end">
        <SearchField aria-label="Filter" value={search} onChange={setSearch} />
        <DialogTrigger>
          <TooltipTrigger>
            <Button aria-label="Filters" variant="secondary" className="w-9 h-9 p-0 relative">
              <FilterIcon className="inline w-5 h-5" />
              {filters > 0 && <div className="absolute -top-2 -right-2 rounded-full h-4 aspect-square text-white text-xs bg-blue-600">{filters}</div>}
            </Button>
            <Tooltip>Filters</Tooltip>
          </TooltipTrigger>
          <Popover showArrow>
            <Dialog className="outline-none p-4 max-h-[inherit] overflow-auto w-[350px]">
              <Heading slot="title" className="text-lg font-semibold mb-2">Filters</Heading>
              {filters > 0 && <Button onPress={clearFilters} variant="secondary" className="absolute top-4 right-4 py-1 px-2 text-xs">Clear</Button>}
              <div className="flex flex-col gap-4">
                <Checkbox isSelected={favorite} onChange={setFavorite}>Favorite</Checkbox>
                <TagGroup label="Cycle" selectionMode="multiple" selectedKeys={cycles} onSelectionChange={setCycles}>
                  <Tag id="Perennial" color="green">{cycleIcons['Perennial']} Perennial</Tag>
                  <Tag id="Herbaceous Perennial" color="green">{cycleIcons['Herbaceous Perennial']} Herbaceous Perennial</Tag>
                </TagGroup>
                <TagGroup label="Sunlight" selectionMode="multiple" selectedKeys={sunlight} onSelectionChange={setSunlight}>
                  <Tag id="full sun" color="yellow">{sunIcons['full sun']} Full Sun</Tag>
                  <Tag id="part sun" color="yellow">{sunIcons['part sun']} Part Sun</Tag>
                  <Tag id="part shade" color="yellow">{sunIcons['part shade']} Part Shade</Tag>
                </TagGroup>
                <TagGroup label="Watering" selectionMode="multiple" selectedKeys={watering} onSelectionChange={setWatering}>
                  <Tag id="Frequent" color="blue">{wateringIcons['Frequent']} Frequent</Tag>
                  <Tag id="Average" color="blue">{wateringIcons['Average']} Average</Tag>
                  <Tag id="Minimum" color="blue">{wateringIcons['Minimum']} Minimum</Tag>
                </TagGroup>
                {/* <DateRangePicker label="Last watered date" /> */}
              </div>
            </Dialog>
          </Popover>
        </DialogTrigger>
        <MenuTrigger>
          <TooltipTrigger>
            <Button aria-label="Columns" variant="secondary" className="w-9 h-9 p-0">
              <SlidersIcon className="inline w-5 h-5" />
            </Button>
            <Tooltip>Columns</Tooltip>
          </TooltipTrigger>
          <Menu selectionMode="multiple" selectedKeys={visibleColumns} onSelectionChange={setVisibleColumns}>
            <MenuItem id="common_name">Name</MenuItem>
            <MenuItem id="cycle">Cycle</MenuItem>
            <MenuItem id="sunlight">Sunlight</MenuItem>
            <MenuItem id="watering">Watering</MenuItem>
          </Menu>
        </MenuTrigger>
        <div className="flex-1" />
        <DialogTrigger>
          <Button aria-label="Add plant" variant="secondary" className="w-9 h-9 p-0">
            <PlusIcon className="inline w-5 h-5" />
          </Button>
          <Modal>
            <PlantDialog onSave={addItem} />
          </Modal>
        </DialogTrigger>
      </div>
      <ResizableTableContainer className="flex-1 w-full overflow-auto relative border rounded-lg" onScroll={onScroll}>
        <Table aria-label="My plants" selectionMode="multiple" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
          <TableHeader columns={columns}>
            {column => <Column {...column} />}
          </TableHeader>
          <TableBody items={items}>
            {item => (
              <Row columns={columns}>
                {column => {
                  switch (column.id) {
                    case 'favorite':
                      return (
                        <Cell>
                          <ToggleButton aria-label="Favorite" isSelected={item.isFavorite} onChange={v => toggleFavorite(item.id, v)} className="group cursor-default align-middle rounded outline-none focus-visible:outline-blue-600">
                            <StarIcon className="w-5 h-5 text-gray-500 group-pressed:text-gray-600 fill-white group-selected:text-gray-700 group-selected:group-pressed:text-gray-800 group-selected:fill-current" />
                          </ToggleButton>
                        </Cell>
                      );
                    case 'common_name':
                      return (
                        <Cell>
                          <div className="grid grid-cols-[40px_1fr] gap-x-2">
                            <img src={item.default_image?.thumbnail} className="inline rounded row-span-2 object-contain h-[40px]" />
                            <span className="truncate capitalize">{item.common_name}</span>
                            <span className="truncate text-xs text-gray-600">{item.scientific_name}</span>
                          </div>
                        </Cell>
                      );
                    case 'cycle':
                      return <Cell><CycleLabel cycle={item.cycle} /></Cell>;
                    case 'sunlight':
                      return <Cell><SunLabel sun={getSunlight(item)} /></Cell>;
                    case 'watering':
                      return <Cell><WateringLabel watering={item.watering} /></Cell>;
                    case 'actions':
                      return (
                        <Cell>
                          <MenuTrigger>
                            <Button variant="icon"><MoreHorizontal className="w-5 h-5" /></Button>
                            <Menu onAction={action => onAction(item, action)}>
                              <MenuItem id="favorite"><StarIcon className="w-4 h-4" /> {item.isFavorite ? 'Unfavorite' : 'Favorite'}</MenuItem>
                              <MenuItem id="edit"><PencilIcon className="w-4 h-4" /> Edit…</MenuItem>
                              <MenuItem id="delete"><TrashIcon className="w-4 h-4" /> Delete…</MenuItem>
                            </Menu>
                          </MenuTrigger>
                        </Cell>
                      );
                    default:
                      return <></>;
                  }
                }}
              </Row>
            )}
          </TableBody>
        </Table>
      </ResizableTableContainer>
      <Modal isOpen={dialog === 'delete'} onOpenChange={onDialogClose}>
        <AlertDialog title="Delete Plant" variant="destructive" actionLabel="Delete">
          Are you sure you want to delete "{actionItem?.common_name}"?
        </AlertDialog>
      </Modal>
      <Modal isOpen={dialog === 'edit'} onOpenChange={onDialogClose}>
        <PlantDialog item={actionItem} onSave={editItem} />
      </Modal>
    </div>
  );
}

const labelStyles = {
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200'
};

function Label({color, icon, children}: {color: keyof typeof labelStyles, icon: React.ReactNode, children: React.ReactNode}) {
  return <span className={`${labelStyles[color]} text-xs rounded-full border px-2 flex items-center max-w-fit gap-1`}>{icon} <span className="truncate capitalize">{children}</span></span>;
}

const cycleIcons = {
  'Perennial': <RefreshCw className="w-4 h-4 flex-shrink-0" />,
  'Herbaceous Perennial': <RefreshCw className="w-4 h-4 flex-shrink-0" />,
  // 'Annual':
};

function CycleLabel({cycle}: {cycle: string}) {
  return <Label color="green" icon={cycleIcons[cycle]}>{cycle}</Label>
}

const sunIcons = {
  'full sun': <Sun className="w-4 h-4 flex-shrink-0" />,
  'part sun': <SunDim className="w-4 h-4 flex-shrink-0" />,
  'part shade': <CloudSun className="w-4 h-4 flex-shrink-0" />
};

const sunColors = {
  'full sun': 'yellow',
  'part sun': 'yellow',
  'part shade': 'gray'
}

function SunLabel({sun}: {sun: string}) {
  return <Label color={sunColors[sun]} icon={sunIcons[sun]}>{sun}</Label>
}

function getSunlight(item: Plant) {
  return (item.sunlight.find(s => s.startsWith('part')) || item.sunlight[0]).split('/')[0];
}

const wateringIcons = {
  'Frequent': <Droplets className="w-4 h-4 flex-shrink-0" />,
  'Average': <Droplet className="w-4 h-4 flex-shrink-0" />,
  'Minimum': <Dessert className="w-4 h-4 flex-shrink-0" />,
};

const wateringColors = {
  'Frequent': 'blue',
  'Average': 'blue',
  'Minimum': 'gray'
}

function WateringLabel({watering}: {watering: string}) {
  return <Label color={wateringColors[watering]} icon={wateringIcons[watering]}>{watering}</Label>
}

function PlantDialog({item, onSave}: {item?: Plant | null, onSave: (item: Plant) => void}) {
  let [droppedImage, setDroppedImage] = useState(item?.default_image?.thumbnail);
  return (
    <Dialog className="outline-none relative">
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="text-2xl font-semibold leading-6 my-0 text-slate-700">
            {item ? 'Edit Plant' : 'Add Plant'}
          </Heading>
          <Form
            onSubmit={e => {
              e.preventDefault();
              close();
              let data = Object.fromEntries(new FormData(e.currentTarget)) as any;
              data.sunlight = [data.sunlight];
              data.scientific_name = [data.scientific_name];
              data.default_image = {thumbnail: data.image};
              data.id = item?.id || Date.now();
              data.isFavorite = item?.isFavorite || false;
              onSave(data);
            }}
            className="mt-6 flex flex-col gap-3">
            <div className="flex gap-4">
              <DropZone
                getDropOperation={types => types.has('image/jpeg') || types.has('image/png') ? 'copy' : 'cancel'}
                onDrop={async e => {
                  let item = e.items.filter(isFileDropItem).find(item => (item.type === 'image/jpeg' || item.type === 'image/png'));
                  if (item) {
                    setDroppedImage(URL.createObjectURL(await item.getFile()));
                  }
                }}
                className="w-32 p-2 flex items-center justify-center border-2 border-gray-400 border-dashed rounded-xl text-gray-500 focus-visible:border-blue-600 focus-visible:border-solid drop-target:border-blue-600 drop-target:border-solid drop-target:bg-blue-100 drop-target:text-blue-600">
                {droppedImage
                  ? <img src={droppedImage} className="w-full h-full object-contain" />
                  : <Text slot="label" className="italic text-sm text-center">
                      Drop or paste image here
                    </Text>
                }
                <input type="hidden" name="image" value={droppedImage} />
              </DropZone>
              <div className="flex flex-col gap-3 flex-1">
                <TextField label="Common Name" name="common_name" isRequired defaultValue={item?.common_name} autoFocus />
                <TextField label="Scientific Name" name="scientific_name" isRequired defaultValue={item?.scientific_name} />
              </div>
            </div>
            <Select label="Cycle" name="cycle" isRequired defaultSelectedKey={item?.cycle}>
              <SelectItem id="Perennial">{cycleIcons['Perennial']} Perennial</SelectItem>
              <SelectItem id="Herbaceous Perennial">{cycleIcons['Herbaceous Perennial']} Herbaceous Perennial</SelectItem>
            </Select>
            <Select label="Sunlight" name="sunlight" isRequired defaultSelectedKey={item ? getSunlight(item) : null}>
              <SelectItem id="full sun">{sunIcons['full sun']} Full Sun</SelectItem>
              <SelectItem id="part sun">{sunIcons['part sun']} Part Sun</SelectItem>
              <SelectItem id="part shade">{sunIcons['part shade']} Part Shade</SelectItem>
            </Select>
            <Select label="Watering" name="watering" isRequired defaultSelectedKey={item?.watering}>
              <SelectItem id="Frequent">{wateringIcons['Frequent']} Frequent</SelectItem>
              <SelectItem id="Average">{wateringIcons['Average']} Average</SelectItem>
              <SelectItem id="Minimum">{wateringIcons['Minimum']} Minimum</SelectItem>
            </Select>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {item ? 'Save' : 'Add'}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Dialog>
  );
}
