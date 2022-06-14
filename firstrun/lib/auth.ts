import { getDB } from "./db";
import { loadSession } from "./session";


export async function isAuthed(token: string): Promise<boolean> {

  // is auth enabled?
  const db = await getDB();
  const row = await db.get(`select val from firstrun_var where key = $1`, `auth.password`);
  if (!row || !row.val) {
    return true;
  }

  const sess = await loadSession(token);
  if (!sess) {
    return false;
  }

  return true;
}
