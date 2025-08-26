import React from "react";
import { ICommand, defaultCommands } from "@uiw/react-markdown-editor";
import config from "../../config";

export interface GalleryOpenState {
  open: boolean;
  onClose: (name?: string, id?: number) => void;
}

export const closedGalleryState: GalleryOpenState = {
  open: false,
  onClose: () => {
    return void 0;
  },
};

export const getMarkdownCommands = (
  setGalleryOpen: React.Dispatch<GalleryOpenState>
): ICommand[] => {
  const imageFromGallery: ICommand = {
    name: "imageFromGallery",
    keyCommand: "imageFromGallery",
    icon: (
      <svg fill="currentColor" viewBox="0 0 16 16" height="14" width="14">
        <path
          fillRule="evenodd"
          d="M1.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 0 1 .03-.03l6.077-6.078a1.75 1.75 0 0 1 2.412-.06L14.5 10.31V2.75a.25.25 0 0 0-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 0 1 .344-.009l4.298 3.889v.917a.25.25 0 0 1-.25.25zm1.75-.25V2.75A1.75 1.75 0 0 0 14.25 1H1.75A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25zM5.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM7 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        />
      </svg>
    ),
    execute: ({ state, view }) => {
      if (!state || !view) return;
      setGalleryOpen({
        open: true,
        onClose: (name?: string, id?: number) => {
          try {
            if (!name) return;
            const main = view.state.selection.main;
            const insertText = `![${name}](/faqImage/${id})`;
            view.dispatch({
              changes: {
                from: main.from,
                to: main.to,
                insert: insertText,
              },
              selection: { anchor: main.from + insertText.length },
            });
          } finally {
            setGalleryOpen(closedGalleryState);
          }
        },
      });
    },
  };

  return Object.values(defaultCommands)
    .filter((it) => !/^(fullscreen|preview)/.test(it.name as string))
    .map((it) => {
      if (it.name === "image") return imageFromGallery;
      return it;
    });
};

export const transformImageUri = (src: string): string => {
  if (src.startsWith("/faqImage"))
    return `${config.baseURLApi}/medicalNetFaq${src}`;
  return src;
}