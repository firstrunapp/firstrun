import * as srs from "secure-random-string";
import * as jwt from "jsonwebtoken";
import { getDB } from "./db";

/* tslint:disable:variable-name */
interface Claims {
  session_id: string;
}

export class Session {
  public id: string;
  public createdAt: number;
  public expiresAt: number;

  constructor() {
    this.id = '';
    this.createdAt = 0;
    this.expiresAt = 0;
  }

  public async getToken(): Promise<string> {
    try {
      const claims: Claims = {
        session_id: this.id,
      };

      const jwtSigningKey = await getJwtSigningKey();
      const token = jwt.sign(claims, jwtSigningKey);
      return token;
    } catch (err) {
      console.error(err);
      return "";
    }
  }
}

async function getJwtSigningKey(): Promise<jwt.Secret> {
  const db = await getDB();
  const row = await db.get(`select val from firstrun_var where key = $1`, `jwt.signing.key`);
  if (row && row.val) {
    return row.val;
  }

  let newKey = srs.default({ length: 64 });
  await db.run(`replace into firstrun_var (key, val) values ($1, $2)`, 'jwt.signing.key', newKey);
  return newKey;
}

export async function createSession(): Promise<Session | undefined> {
  const sess = new Session();
  sess.id = srs.default({ length: 36 });

  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  sess.createdAt = createdAt.getTime();
  sess.expiresAt = expiresAt.getTime();

  try {
    const db = await getDB();
    const r = await db.run(`insert into session (id, created_at, expire_at) values ($1, $2, $3)`,
      sess.id, sess.createdAt, sess.expiresAt);

    return sess;
  } catch (err) {
    console.error(err);
    return;
  }
}

export async function loadSession(token: string): Promise<Session | undefined> {
  try {
    const signingKey = await getJwtSigningKey();
    const claims = await jwt.verify(token, signingKey) as jwt.JwtPayload;

    const db = await getDB();
    const row = await db.get(`select id, created_at, expire_at from session where id = $1`, claims.session_id);
    if (!row) {
      return;
    }

    const sess = new Session();
    sess.id = claims.session_id;
    sess.createdAt = row.created_at;
    sess.expiresAt = row.expire_at;

    return sess;
  } catch (err) {
    console.error(err);
    return;
  }
}

