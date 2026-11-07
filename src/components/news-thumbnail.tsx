import React from "react";
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image";

type NewsThumbnailProps = {
  image: IGatsbyImageData;
  positionX?: number | null;
  positionY?: number | null;
  className?: string;
};

const position = (value: number | null | undefined): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : 50;

// Keep this frame and object-position in sync with the portal's news editor.
const NewsThumbnail: React.FC<NewsThumbnailProps> = ({
  image,
  positionX,
  positionY,
  className = "",
}) => (
  <div
    className={`relative w-full self-start overflow-hidden dark:bg-gray-500 ${className}`}
    style={{ aspectRatio: "16 / 9" }}
  >
    <GatsbyImage
      image={image}
      alt=""
      objectFit="cover"
      objectPosition={`${position(positionX)}% ${position(positionY)}%`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  </div>
);

export default NewsThumbnail;
