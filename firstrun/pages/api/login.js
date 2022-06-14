import { createSession } from "../../lib/session";
import { getDB } from "../../lib/db";
const bcrypt = require('bcrypt');
import Cookies from 'cookies';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  if (!req.body.password) {
    res.status(400).send({ error: 'Bad request' });
    return;
  }

  const db = await getDB();
  const row = await db.get(`select val from firstrun_var where key = $1`, `auth.password`)
  if (!row || !row.val) {
    console.error(`no row returned from auth.password`);
    res.status(500).send({ error: 'Internal server error' });
    return;
  }

  const compareResult = await bcrypt.compare(req.body.password, row.val);
  if (!compareResult) {
    res.status(401).send({ error: 'Invalid password' });
    return;
  }

  const sess = await createSession();
  if (!sess) {
    res.status(500).send({ error: 'Unable to create session' });
    return;
  }

  const token = await sess.getToken();
  const cookies = new Cookies(req, res)

  cookies.set('auth', token, {
    httpOnly: true,
  });

  res.status(201).send({});
}
