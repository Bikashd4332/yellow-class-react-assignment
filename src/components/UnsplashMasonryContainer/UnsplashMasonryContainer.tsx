import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import UnsplashMasonry  from '../UnsplashMasonry/UnsplashMasonry';
import fetchImages, { UnsplashResponse } from '../../services/fetchImages';
import Modal from '../Modal/Modal';

export default function UnsplashMasonryContainer() {

    const [list, setList] = useState<UnsplashResponse[]>([]);
    const [detailViewImageIndex, setDetailViewImageIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchImages(30, 1)
            .then(response => setList(prevData => [...prevData, ...response]));
    }, [])

    const clickHandler: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
        setDetailViewImageIndex(Number((event.target as HTMLDivElement).dataset.index));
    }, []);

    const nextHandle: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
        const index = detailViewImageIndex

        if (!index) { throw Error('error') };

        if ( index === 0) {
            alert('Cant go previous');
        } else {
            setDetailViewImageIndex(index - 1);
        }
    }, [detailViewImageIndex]);

    const previousHandle: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
        const index = detailViewImageIndex

        if (!index) { throw Error('error') };

        if (index >= list?.length) {
            alert('Cant go next');
        } else {
            setDetailViewImageIndex(index + 1);
        }
    }, [detailViewImageIndex, list]);

    return (
        <div style={{ width: '100%' }}>
            <UnsplashMasonry {...{list, columnWidth: 200, gutterSize: 25, overscanByPixels: 3, clickHandler}} />
            { detailViewImageIndex && <Modal urls={list[detailViewImageIndex]?.urls} nextHandle={nextHandle} previousHandle={previousHandle} />  }
        </div>
    )
}
