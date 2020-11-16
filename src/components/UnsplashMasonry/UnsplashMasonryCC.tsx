import React, { MouseEventHandler } from "react";
import {
  Masonry,
  MasonryCellProps,
  createCellPositioner,
  Positioner,
} from "react-virtualized/dist/commonjs/Masonry";
import {
  WindowScroller,
  WindowScrollerChildProps,
} from "react-virtualized/dist/commonjs/WindowScroller";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import {
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized/dist/commonjs/CellMeasurer";
import { UnsplashResponse } from "../../services/fetchImages";
import InfiniteScroll from "react-infinite-scroll-component";

export type UnsplashMasonryProps = {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  list: Array<
    { size: { width: number; height: number } } & { item: UnsplashResponse }
  >;
  columnWidth: number;
  gutterSize: number;
  isPageLoading: boolean;
  fetchNextPage: () => Promise<void>;
  overScanByPixel: number;
  perPage: number;
};

class UnsplashMasonry extends React.Component<UnsplashMasonryProps> {
  private _scrollTop: number | null;
  private _height: number | null;
  private _width: number | null;
  private _cellMeasurerCache: CellMeasurerCache;
  private _cellPositioner: Positioner | undefined;
  private _masonryRef: Masonry | null;
  private _scrollElementRef: HTMLDivElement | null;
  private _columnCount: number | null;

  constructor(props: UnsplashMasonryProps) {
    super(props);
    // initialize
    this._scrollTop = null;
    this._height = null;
    this._width = null;
    this._cellPositioner = undefined;
    this._masonryRef = null;
    this._scrollTop = null;
    this._scrollElementRef = null;
    this._columnCount = null;

    this._autoSizer = this._autoSizer.bind(this);
    this._renderMasonry = this._renderMasonry.bind(this);
    this._setRef = this._setRef.bind(this);
    this._setScrollElementRef = this._setScrollElementRef.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._calculateColumnCount = this._calculateColumnCount.bind(this);
    this._initCellPositioner = this._initCellPositioner.bind(this);
    this._onResize = this._onResize.bind(this);
    this._resetCellPositioner = this._resetCellPositioner.bind(this);

    this._cellMeasurerCache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true,
    });
  }

  render() {
    return (
      <InfiniteScroll
        dataLength={this.props.list.length}
        next={this.props.fetchNextPage}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <WindowScroller
          overScanByPixle={this.props.overScanByPixel}
          onResize={this._onResize}
          rowCount={this.props.list?.length}
        >
          {this._autoSizer}
        </WindowScroller>
      </InfiniteScroll>
    );
  }

  private _autoSizer({ height, scrollTop }: WindowScrollerChildProps) {
    this._scrollTop = scrollTop;
    this._height = height;

    debugger;

    return (
      <AutoSizer
        disableHeight
        rowCount={this.props.list?.length}
        height={height}
        onResize={this._onResize}
        overscanByPixels={this.props.overScanByPixel}
        scrollTop={scrollTop}
      >
        {this._renderMasonry}
      </AutoSizer>
    );
  }

  private _onResize({ width }: { width: number }) {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonryRef?.recomputeCellPositions();
  }

  private _resetCellPositioner() {
    const { columnWidth, gutterSize } = this.props;

    this._cellPositioner?.reset({
      columnCount: this._columnCount!,
      columnWidth,
      spacer: gutterSize,
    });
  }
  private _calculateColumnCount() {
    const { columnWidth, gutterSize } = this.props;
    this._columnCount = Math.floor(this._width! / (columnWidth + gutterSize));
  }

  private _initCellPositioner() {
    if (typeof this._cellPositioner === "undefined") {
      const { columnWidth, gutterSize } = this.props;

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cellMeasurerCache,
        columnCount: this._columnCount!,
        columnWidth: columnWidth,
        spacer: gutterSize,
      });
    }
  }

  private _renderMasonry({ width }: { width: number }) {
    this._width = width;

    this._calculateColumnCount();
    this._initCellPositioner();

    return (
      <Masonry
        autoHeight
        keyMapper={(item, index) => this.props.list[item].item.id}
        ref={this._setRef}
        height={this._height!}
        width={this._width}
        cellCount={this.props.list.length}
        cellMeasurerCache={this._cellMeasurerCache}
        cellPositioner={this._cellPositioner!}
        cellRenderer={this._cellRenderer}
        overscanByPixels={this.props.overScanByPixel}
        scrollTop={this._scrollTop}
      ></Masonry>
    );
  }

  private _cellRenderer({ index, key, parent, style }: MasonryCellProps) {
    const { size, item } = this.props.list[index];
    const height = this.props.columnWidth * (size.height / size.width) || 200;
    return (
      <CellMeasurer
        cache={this._cellMeasurerCache}
        index={index}
        key={key}
        parent={parent}
      >
        <div
          onClick={this.props.clickHandler}
          style={{
            ...style,
            width: this.props.columnWidth || 200,
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "5px",
          }}
          data-index={index}
        >
          <img
            alt="unsplash"
            src={item?.urls?.thumb}
            data-index={index}
            style={{
              width: this.props.columnWidth,
              height: height,
              display: "block",
            }}
          />
          <p
            style={{
              padding: 0,
              margin: 0,
              fontSize: "0.7 rem",
              color: "#fff",
            }}
            data-index={index}
          >
            {item?.description ?? item?.alt_description}
          </p>
        </div>
      </CellMeasurer>
    );
  }
  private _setRef(instance: Masonry) {
    this._masonryRef = instance;
  }

  private _setScrollElementRef(instance: HTMLDivElement) {
    this._scrollElementRef = instance;
  }
}

export default UnsplashMasonry;
