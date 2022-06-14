import { setValue } from "../../lib/schema/schema";

export default async function handler(req, res) {
  const items = req.body.items;
  for (const item of items) {
    await setValue(item.groupHref, item.itemName, item.value);
  }

  res.status(200).json({message: "Saved"});
}
