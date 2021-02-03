export const mockBookmarks = {
  "8094ee16-af30-464c-a100-c565cb52a751": {
    id: "8094ee16-af30-464c-a100-c565cb52a751",
    title: "The Internet Country - Tigerfeathers!",
    url: "https://tigerfeathers.substack.com/p/the-internet-country",
    toRead: true,
    tags: {
      "185621f8-8bea-4778-9d0d-e955e7907b60": {
        id: "185621f8-8bea-4778-9d0d-e955e7907b60",
        title: "Startups",
        color: "bg-orange-400",
      },
    },
    created: "26th January, 2021",
    updated: "",
  },
};

export const mockTags = Object.values(mockBookmarks).reduce(
  (acc, cur) => ({ ...acc, ...cur.tags }),
  {},
);
