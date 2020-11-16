import React, { MouseEventHandler } from "react";
import "./Modal.css";
import leftArrow from "./left-chevron.svg";
import rightArrow from "./right-chevron.svg";
import backArrow from "./left-arrow.svg";
import { UnsplashUrls } from "../../services/fetchImages";

type ModalProps = {
  nextHandle: MouseEventHandler<HTMLDivElement>;
  previousHandle: MouseEventHandler<HTMLDivElement>;
  canGoNext: boolean;
  closeModal: () => void;
  canGoPrevious: boolean;
  urls: UnsplashUrls;
};

export default function Modal({
  nextHandle,
  previousHandle,
  urls,
  closeModal,
  canGoNext,
  canGoPrevious,
}: ModalProps) {
  return (
    <div className="ModalBackdrop">
      <div className="Modal">
        <img
          alt="close modal"
          onClick={closeModal}
          src={backArrow}
          className="backArrow"
        />
        {canGoPrevious && (
          <img
            alt="go previous"
            onClick={previousHandle}
            src={leftArrow}
            className="leftArrow"
          />
        )}
        <img alt="unsplash" src={urls.regular} id="unpsplash-img" />
        {canGoNext && (
          <img
            alt="go next"
            onClick={nextHandle}
            src={rightArrow}
            className="rightArrow"
          />
        )}
      </div>
    </div>
  );
}
