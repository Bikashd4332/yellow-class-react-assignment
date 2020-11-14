import React, { MouseEventHandler} from 'react';
import './Modal.css';
import leftArrow from './left-chevron.svg';
import rightArrow from './right-chevron.svg';
import { UnsplashUrls } from '../../services/fetchImages'

type ModalProps = {
    nextHandle: MouseEventHandler<HTMLDivElement>,
    previousHandle: MouseEventHandler<HTMLDivElement>,
    urls: UnsplashUrls,
}

export default function Modal({ nextHandle, previousHandle, urls }: ModalProps){
    return (
        <div className="ModalBackdrop">
            <div className="Modal">
                <img alt="unsplash" onClick={nextHandle} src={leftArrow} className="leftArrow" />
                <img alt="unsplash" src={urls.regular} id="unpsplash-img" />
                <img alt="unsplash" onClick={previousHandle} src={rightArrow} className="rightArrow" />
            </div>
        </div>
    )
 }
