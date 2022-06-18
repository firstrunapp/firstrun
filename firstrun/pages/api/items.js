import { getDB } from "../../lib/db";
import { loadSchema, loadValues, loadDefaults, setValue } from "../../lib/schema/schema";
var request = require('request');

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const items = req.body.items;
    for (const item of items) {
      await setValue(item.groupHref, item.itemName, item.value);
    }

    // fire any callbacks
    // this really should be async

    const db = await getDB()
    const callbacks = await db.all(`select url, invalid_count from callback_url where invalid_count < 3`);
    callbacks.forEach((callback) => {
      request.post(
        callback.url,
        { },
        async function (err, response, body) {
            if (err || response.statusCode >= 400) {
                await db.run(`update callback_url set invalid_count = $1 where url = $2`, callback.invalid_count, callback.url);
            }
        }
      );
    })
    res.status(200).json({message: "Values saved."});
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

    if (token !== process.env.INTERNAL_API_TOKEN) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const schema = await loadSchema();

    let values = {};
    for (const group of schema.groups) {
      const groupDefaults = await loadDefaults(group.href);
      const groupValues = await loadValues(group.href);
      values = {...values, ...groupDefaults, ...groupValues};
    }

    res.status(200).json(values);
  }
}
