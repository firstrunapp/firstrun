import { getDB } from "../../lib/db"

export default async function handler(req, res) {
  // this needs a whole lot more thought
  // but we just write the callback url to the database

  // and keep it there until it refuses to answer

  // there are a few security issues here

  const db = await getDB()
  await db.run(`replace into callback_url (url, invalid_count) values ($1, 0)`, req.body.callbackUrl);

  res.status(200).json({})
}
