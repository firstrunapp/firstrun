import { loadSchema, loadValues, setValue } from "../../lib/schema/schema";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const items = req.body.items;
    for (const item of items) {
      await setValue(item.groupHref, item.itemName, item.value);
    }

    res.status(200).json({message: "Saved"});
    return;
  } else if (req.method === 'GET') {
    // only support internal api token auth for now
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({message: "Unauthorized"});
      return
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const token = tokenParts[1];

    if (token !== "abcdef") {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const schema = await loadSchema();
    console.log("asdasd");
    console.log(schema.groups);

    let values = {};
    for (const group in schema.groups) {
      const groupDefaults = await loadDefaults(group.href);
      const groupValues = await loadValues(group.href);
      values = {...values, ...groupDefaults, ...groupValues};
    }

    res.status(200).json(values);
  }
}
