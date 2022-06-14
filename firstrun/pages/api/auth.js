import { getDB } from "../../lib/db";
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  if (!req.body.password) {
    res.status(400).send({ error: 'Bad request' });
  }

  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const db = await getDB()
    await db.run(`replace into firstrun_var (key, val) values (?, ?)`, "auth.password", hashed);
    res.status(201).send({});
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
}
