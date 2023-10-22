"use client";

import React, { useEffect, useState } from "react";
import IframeResizer from "iframe-resizer";

interface IFrameComponentProps {
  src: string;
  size: string;
}

export const IFrameComponent: React.FC<IFrameComponentProps> = ({
  src,
  size,
}) => {
  let [done, setDone] = useState<boolean>(false);
  useEffect(() => {
    const iframe = document.getElementById("form");
    if (iframe) {
      IframeResizer.iframeResizer({ log: false }, iframe);
      iframe.style.height = size;
      setDone(true);
    }
  }, [src]);

  return (
    <iframe
      id="form"
      key="1"
      src={src}
      title="Formular"
      className="mt-8 w-full h-screen"
    ></iframe>
  );
};
