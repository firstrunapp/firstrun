export default function handler(req, res) {
  const resp = {
    appName: "test",
    groups: [
      {
        title: "App Configuration",
        filename: "test",
        href: "test",
        index: 0,
      },
    ],
  };

  res.status(200).json(resp)
}
