import React, { useState, MouseEventHandler, useMemo, RefCallback }  from 'react';
import  { Masonry } from 'react-virtualized/dist/commonjs/Masonry';
import  { WindowScroller } from 'react-virtualized/dist/commonjs/WindowScroller';
import  { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import  { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { createMasonryCellPositioner, CellMeasurerCache, MasonryCellProps, Size, WindowScrollerChildProps} from 'react-virtualized'
import { UnsplashResponse } from '../../services/fetchImages';

export type UnsplashMasonryProps = {
    clickHandler: MouseEventHandler<HTMLDivElement>,
    list: Array<{ size: { width: number, height: number } } & { item: UnsplashResponse }>,
    columnWidth: number,
    gutterSize: number,
    overscanByPixels: number,
}

export default function UnsplashMasonry(props: UnsplashMasonryProps){

    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

    const cellMeasurerCache = useMemo(() => ( new CellMeasurerCache({
        defaultHeight: 200,
        defaultWidth: 200,
        fixedWidth: true,
    })), []);

    const setRefForScrollElement: RefCallback<HTMLDivElement> = (ref) => { setScrollElement(ref); }

    const autoResizer = ({ height, scrollTop }: WindowScrollerChildProps) => {
        return (
            <AutoSizer
                disableHeight
                height={height}
                overscanByPixels={props.overscanByPixels}
                scrollTop={scrollTop}>
                { ({ width } : Size) =>
                    <Masonry
                        autoHeight
                        height={height}
                        cellCount={props.list.length}
                        cellMeasurerCache = {cellMeasurerCache}
                        cellPositioner = {createMasonryCellPositioner({
                            cellMeasurerCache: cellMeasurerCache,
                            columnCount: Math.floor(width / (props.columnWidth + props.gutterSize )),
                            columnWidth: props.columnWidth,
                            spacer: props.gutterSize,
                        })}
                        cellRenderer={cellRenderer}
                        overscanByPixels={props.overscanByPixels}
                        scrollTop={scrollTop}
                        width={width}
                    />
                }
            </AutoSizer>
        )
    };

    const cellRenderer = ({ index, key, parent, style }: MasonryCellProps ) => {
        console.log(props.list, index);
        const {size, item} = props.list[index];
        const height = props.columnWidth * (size.height / size.width) || 200;

        return (
            <CellMeasurer cache={cellMeasurerCache}  index={index} key={key} parent={parent}>
                <div style={{ ...style,
                              width: (props.columnWidth || 200),
                              padding: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: '5px'}}
                    onClick={props.clickHandler}
                    data-index={index}
                >
                    <img alt="unsplash"
                         src={item?.urls?.thumb}
                         data-index={index}
                         style={{
                            height: height,
                            width: props.columnWidth,
                             display: "block"
                         }}
                    />
                    <p style={{
                        padding: 0,
                        margin: 0,
                        fontSize: '0.7 rem',
                        color: '#fff'
                    }}
                       data-index={index}
                    >
                        { item?.description ?? item?.alt_description}
                    </p>
                </div>
            </CellMeasurer>
        )
    };

    return (
        <div ref={setRefForScrollElement}>
            <WindowScroller overScanByPixle={props.overscanByPixels} scrollElement={scrollElement!}>
                { autoResizer }
            </WindowScroller>
        </div>
    );
}
