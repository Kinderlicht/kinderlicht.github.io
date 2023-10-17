export type Author = { name: string; description: string; image: string };

export const authors: { [key: string]: Author } = {
  Kinderlicht: {
    name: "Kinderlicht Wallerdorf e.V.",
    description: "Der offizielle Vereinsaccount",
    image: "/news/author/kinderlicht.png",
  },
  "Enrico Koch": {
    name: "Enrico Koch",
    description: "Erster Vorstand",
    image: "/news/author/enrico.jpg",
  },
};
