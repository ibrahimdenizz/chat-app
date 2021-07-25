const config = {
  URL: process.env.NODE_ENV === "production" ? "" : "http://localhost:5000",
  INIT_ROOM: [
    {
      id: "Public 1",
      name: "Public 1",
    },
    {
      id: "Public 2",
      name: "Public 2",
    },
  ],
};

export default config;
