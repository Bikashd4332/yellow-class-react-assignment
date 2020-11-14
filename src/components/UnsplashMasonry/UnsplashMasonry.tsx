import React, { MouseEventHandler, useMemo }  from 'react';
import  { Masonry } from 'react-virtualized/dist/commonjs/Masonry';
import  { WindowScroller } from 'react-virtualized/dist/commonjs/WindowScroller';
import  { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import  { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { createMasonryCellPositioner, CellMeasurerCache, MasonryCellProps, Size, WindowScrollerChildProps} from 'react-virtualized'
import { UnsplashResponse } from '../../services/fetchImages';

export type UnsplashMasonryProps = {
    clickHandler: MouseEventHandler<HTMLDivElement>,
    list: UnsplashResponse[],
    columnWidth: number,
    gutterSize: number,
    overscanByPixels: number,
}

export default function UnsplashMasonry(props: UnsplashMasonryProps){
    const cellMeasurerCache = useMemo(() => ( new CellMeasurerCache({
        defaultHeight: 200,
        defaultWidth: 200,
        fixedWidth: true,
    })), []);

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
        const datum = props.list[index];
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
                    <img alt="unsplash" src={datum?.urls?.thumb} data-index={index} />
                    <p style={{
                        padding: 0,
                        margin: 0,
                        fontSize: '0.7 rem',
                        color: '#fff'
                    }}
                       data-index={index}
                    >
                        { datum?.description ?? datum?.alt_description}
                    </p>
                </div>
            </CellMeasurer>
        )
    };

    return <>
        {
            (props.list && props.list.length) ? (
                    <WindowScroller overScanByPixle={props.overscanByPixels} style={{ margin: 'auto', }}>
                        { autoResizer }
                    </WindowScroller>
            ) : (
                    <p style={{ color: '#fff' }}> Loading... </p>
            )
        }
    </>
}