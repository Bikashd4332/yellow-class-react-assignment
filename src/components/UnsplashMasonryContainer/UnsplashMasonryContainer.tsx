import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import UnsplashMasonry from "../UnsplashMasonry/UnsplashMasonryCC";
import fetchImages, { UnsplashResponse } from "../../services/fetchImages";
import Modal from "../Modal/Modal";
// @ts-ignore
import ImageMeasurer from "react-virtualized-image-measurer";

export default function UnsplashMasonryContainer() {
  const [list, setList] = useState<UnsplashResponse[]>([]);
  const [detailViewImageIndex, setDetailViewImageIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchImages(30, 1).then((response) =>
      setList((prevData) => [...prevData, ...response])
    );
  }, []);

  const clickHandler: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      setDetailViewImageIndex(
        Number((event.target as HTMLDivElement).dataset.index)
      );
    },
    []
  );

  const nextHandle: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const index = detailViewImageIndex;

      if (index === null) {
        throw Error("error");
      }

      if (index === list?.length - 1) {
        alert("Cant go next");
      } else {
        setDetailViewImageIndex(index + 1);
      }
    },
    [detailViewImageIndex, list]
  );

  const previousHandle: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const index = detailViewImageIndex;

      if (index === null) {
        throw Error("error");
      }

      if (index === 0) {
        alert("Cant go previous");
      } else {
        setDetailViewImageIndex(index - 1);
      }
    },
    [detailViewImageIndex]
  );

  return (
    <div style={{ width: "100%" }}>
      {list && list.length ? (
        <ImageMeasurer
          defaultHeight={200}
          defaultWidth={200}
          items={list}
          image={
            // @ts-ignore
            (item) => item?.urls?.thumb
          }
          keyMapper={(item: UnsplashResponse, index: number) =>
            item.id || index
          }
        >
          {({
            itemsWithSizes,
          }: {
            itemsWithSizes: Array<
              { size: { width: number; height: number } } & {
                item: UnsplashResponse;
              }
            >;
          }) => (
            <UnsplashMasonry
              {...{
                list: itemsWithSizes,
                columnWidth: 200,
                gutterSize: 25,
                overScanByPixel: 3,
                clickHandler,
              }}
            />
          )}
        </ImageMeasurer>
      ) : (
        <p style={{ color: "#fff" }}> Loading... </p>
      )}
      {detailViewImageIndex !== null && (
        <Modal
          urls={list[detailViewImageIndex]?.urls}
          canGoPrevious={detailViewImageIndex > 0}
          canGoNext={detailViewImageIndex < list.length - 1}
          nextHandle={nextHandle}
          previousHandle={previousHandle}
        />
      )}
    </div>
  );
}
