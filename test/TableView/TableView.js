import assert from 'assert';
import {DragTarget, EditableCollectionView, IndexPath} from '@react/collection-view';
import {mount, shallow} from 'enzyme';
import Provider from '../../src/Provider';
import React from 'react';
import sinon, {stub} from 'sinon';
import TableCell from '../../src/TableView/js/TableCell';
import TableRow from '../../src/TableView/js/TableRow';
import {TableView, TableViewDataSource} from '../../src/TableView';

describe('TableView', function () {
  var ds, renderCell;
  var columns = [
    {title: 'active'},
    {title: 'name'}
  ];
  var cellData = {active: true, name: 'Sunshine Bear'};
  before(function () {
    renderCell = function () {};

    class TableDS extends TableViewDataSource {
      getColumns() {
        return columns;
      }

      getNumberOfRows(section) {
        return 6;
      }

      getCell(column, row, section) {
        return column.title;
      }

      sort() {}
    }

    ds = new TableDS;
  });

  it('should render a table view', function () {
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        allowsSelection
        allowsMultipleSelection />
    );

    assert.equal(table.hasClass('react-spectrum-TableView spectrum-Table'), true);
    assert.deepEqual(table.find(TableRow).prop('columns'), columns);
    assert.deepEqual(table.find(TableRow).prop('allowsSelection'), true);
    assert.deepEqual(table.find(TableRow).prop('allowsSelection'), true);
    assert.deepEqual(table.find(TableRow).prop('isHeaderRow'), true);
  });

  it('should render a quiet table view', function () {
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        allowsSelection={false}
        quiet />
    );
    assert.equal(table.hasClass('spectrum-Table--quiet'), true);
    assert.deepEqual(table.find(TableRow).prop('allowsSelection'), false);
  });

  it('should pass correct props to collectionview', function () {
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        allowsSelection
        selectedIndexPaths={[{section: 0, index: 0}]}
        allowsMultipleSelection
        quiet />
    );

    var collectionView = table.find('.react-spectrum-TableView-body');
    assert.deepEqual(collectionView.prop('dataSource'), ds);
    assert.equal(collectionView.prop('canSelectItems'), true);
    assert.equal(collectionView.prop('allowsMultipleSelection'), true);
    assert.equal(collectionView.prop('selectionMode'), 'toggle');
    assert.deepEqual(collectionView.prop('selectedIndexPaths'), [{section: 0, index: 0}]);
  });

  it('should return Itemview row with props', function () {
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );
    let Wrapper = (props) => props.children;
    let wrapper = shallow(<Wrapper>{table.instance().renderItemView('foo', cellData)}</Wrapper>);

    assert(wrapper.find(TableRow));
    assert.equal(wrapper.find(TableRow).prop('columns'), columns);
    assert.equal(wrapper.find(TableRow).prop('allowsSelection'), true);
  });

  it('should return renderColumnHeader row prop defined header', function () {
    const renderColumnHeader = sinon.spy();
    const col = {title: 'name'};
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        renderColumnHeader={renderColumnHeader} />
    );
    let Wrapper = (props) => props.children;
    let wrapper = shallow(<Wrapper>{table.instance().renderColumnHeader(col)}</Wrapper>);

    assert(wrapper.find(TableCell));
    assert.equal(wrapper.find(TableCell).prop('isHeaderRow'), true);
    assert.deepEqual(wrapper.find(TableCell).prop('column'), col);
    assert.equal(wrapper.find(TableCell).prop('sortDir'), false);
    assert.equal(renderColumnHeader.callCount, 1);
    assert.deepEqual(renderColumnHeader.getCall(0).args[0], col);
  });

  it('should return renderColumnHeader row with props', function () {
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );
    let Wrapper = (props) => props.children;
    let wrapper = shallow(<Wrapper>{table.instance().renderColumnHeader({title: 'name'})}</Wrapper>);

    assert(wrapper.find(TableCell));
    assert.deepEqual(wrapper.find(TableCell).prop('column'), {title: 'name'});
    assert.equal(wrapper.find(TableCell).childAt(0).text(), 'name');
  });

  it('should call props.renderCell in renderCell', function () {
    const renderCell = sinon.spy();
    const col = {title: 'name'};
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );
    let Wrapper = (props) => props.children;
    let wrapper = shallow(<Wrapper>{table.instance().renderCell(['Sunshine Bear', true], col, 0, 0, 0, 0)}</Wrapper>);

    assert(wrapper.find(TableCell));
    assert.deepEqual(wrapper.find(TableCell).prop('column'), col);
    assert.equal(renderCell.callCount, 1);
    assert.deepEqual(renderCell.getCall(0).args[1], 'Sunshine Bear');

    wrapper = shallow(<Wrapper>{table.instance().renderCell(['Sunshine Bear', true], col, 0)}</Wrapper>);

    assert(wrapper.find(TableCell));
    assert.deepEqual(wrapper.find(TableCell).prop('column'), col);
    assert.equal(renderCell.callCount, 2);
    assert.deepEqual(renderCell.getCall(1).args[1], 'Sunshine Bear');
  });

  it('should call internal sort if column prop is set', function () {
    const onSort = sinon.spy(ds, '_sortByColumn');
    const colSort = {title: 'name', sortable: true};
    const col = {title: 'name'};
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        sortable />
    );
    table.instance().sortByColumn(col);

    assert.equal(onSort.callCount, 0);
    table.instance().sortByColumn(colSort);

    assert.equal(onSort.callCount, 1);
    assert.deepEqual(onSort.getCall(0).args[0], colSort);
  });

  it('should call selectionChange if prop is set', function () {
    const onSelectionChange = sinon.spy();
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        sortable
        onSelectionChange={onSelectionChange} />
    );
    table.instance().collection = {selectedIndexPaths: [{section: 0, index: 0}], getNumberOfSections: () => 1, getSectionLength: () => 6};

    table.instance().onSelectionChange();
    assert.equal(onSelectionChange.callCount, 1);
    assert.equal(onSelectionChange.getCall(0).args[0][0].index, 0);
  });

  it('setSelectAll should call selectAll or clearSelection method of collection', () => {
    const selectAll = sinon.spy();
    const clearSelection = sinon.spy();
    const table = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );
    table.instance().collection = {
      selectAll,
      clearSelection,
      selectedIndexPaths: [],
      getNumberOfSections: () => 1,
      getSectionLength: () => 6
    };
    table.instance().setSelectAll(true);
    assert(selectAll.calledOnce);
    table.instance().collection.selectedIndexPaths = [
      {section: 0, index: 0},
      {section: 0, index: 1},
      {section: 0, index: 2},
      {section: 0, index: 3},
      {section: 0, index: 4},
      {section: 0, index: 5}
    ];
    table.instance().onSelectionChange();
    assert(table.instance().collection.selectedIndexPaths.length === ds.getNumberOfRows());
    table.instance().setSelectAll(false);
    assert(clearSelection.calledOnce);
    table.instance().collection.selectedIndexPaths = [];
    table.instance().onSelectionChange();
    assert(table.instance().collection.selectedIndexPaths.length !== ds.getNumberOfRows());
  });

  it('should have collection ref when mounted', () => {
    const table = mount(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );

    assert(table.instance().collection);
    table.unmount();
  });

  it('should render an infiniteScroll table', function () {
    const loadMoreStub = stub(ds, 'loadMore').callsFake(() => {});
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell} />
    );
    const tableInstance = tree.instance();

    // shallow doesn't render down far enough to make this, so create the collection instance
    tableInstance.collection = {contentOffset: 0, contentHeight: 1000, size: {height: 100}, dataSource: ds};
    tree.find(EditableCollectionView).simulate('scroll');

    assert.equal(loadMoreStub.callCount, 0);

    tableInstance.collection.contentOffset = 900;
    tree.find(EditableCollectionView).simulate('scroll');

    assert.equal(loadMoreStub.callCount, 1);
  });

  it('should allow a row height override', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        rowHeight={56} />
    );
    assert.equal(tree.instance().layout.rowHeight, 56);
  });

  it('should have a row height ceiling of 72', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        rowHeight={80} />
    );
    assert.equal(tree.instance().layout.rowHeight, 72);
  });

  it('should have a row height floor of 48', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        rowHeight={24} />
    );
    assert.equal(tree.instance().layout.rowHeight, 48);
  });

  it('should support dragging rows', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        canDragItems />
    );

    assert.equal(tree.find(EditableCollectionView).prop('canDragItems'), true);

    tree.instance().collection = {
      getItemView: (indexPath) => ({children: [
        tree.instance().renderItemView('item', ds.getItem(indexPath.section, indexPath.index))
      ]})
    };

    let Wrapper = (props) => props.children;
    let dragView = shallow(<Wrapper>{tree.instance().renderDragView(new DragTarget('item', new IndexPath(0, 0)))}</Wrapper>);
    assert.equal(dragView.type(), Provider);
    assert.equal(dragView.prop('theme'), 'light');
    assert.equal(dragView.find(TableRow).length, 1);
  });

  it('should pass the correct theme to the drag view from the context', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        canDragItems />
    , {context: {theme: 'dark'}});

    tree.instance().collection = {
      getItemView: (indexPath) => ({children: [
        tree.instance().renderItemView('item', ds.getItem(indexPath.section, indexPath.index))
      ]})
    };

    let Wrapper = (props) => props.children;
    let dragView = shallow(<Wrapper>{tree.instance().renderDragView(new DragTarget('item', new IndexPath(0, 0)))}</Wrapper>);
    assert.equal(dragView.type(), Provider);
    assert.equal(dragView.prop('theme'), 'dark');
  });

  it('should support custom drag views', function () {
    const tree = shallow(
      <TableView
        dataSource={ds}
        renderCell={renderCell}
        canDragItems
        renderDragView={() => <div>Drag view</div>} />
    );

    tree.instance().collection = {
      selectedIndexPaths: []
    };

    let Wrapper = (props) => props.children;
    let dragView = shallow(<Wrapper>{tree.instance().renderDragView(new DragTarget('item', new IndexPath(0, 0)))}</Wrapper>);
    assert.equal(dragView.find('div').length, 1);
    assert.equal(dragView.find('div').text(), 'Drag view');
  });
});
