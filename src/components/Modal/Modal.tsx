import React, { MouseEventHandler } from "react";
import "./Modal.css";
import leftArrow from "./left-chevron.svg";
import rightArrow from "./right-chevron.svg";
import { UnsplashUrls } from "../../services/fetchImages";

type ModalProps = {
  nextHandle: MouseEventHandler<HTMLDivElement>;
  previousHandle: MouseEventHandler<HTMLDivElement>;
  canGoNext: boolean;
  canGoPrevious: boolean;
  urls: UnsplashUrls;
};

export default function Modal({
  nextHandle,
  previousHandle,
  urls,
  canGoNext,
  canGoPrevious,
}: ModalProps) {
  return (
    <div className="ModalBackdrop">
      <div className="Modal">
        {canGoPrevious && (
          <img
            alt="unsplash"
            onClick={previousHandle}
            src={leftArrow}
            className="leftArrow"
          />
        )}
        <img alt="unsplash" src={urls.regular} id="unpsplash-img" />
        {canGoNext && (
          <img
            alt="unsplash"
            onClick={nextHandle}
            src={rightArrow}
            className="rightArrow"
          />
        )}
      </div>
    </div>
  );
}
