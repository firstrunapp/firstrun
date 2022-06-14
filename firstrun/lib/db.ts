import path from 'path';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const os = require("os");
let db: any;

function getDBPath() {
  const userHomeDir = os.homedir();
  return path.join(userHomeDir, "firstrun.db");
}

export async function getDB() {
  if (db) {
    return db;
  }

  const d = await open({
    filename: getDBPath(),
    driver: sqlite3.Database,
  })
  await applySchema(d);
  db = d
  return db;
}

async function applySchema(d: any) {
  await d.run(`create table if not exists firstrun_var (key text not null primary key, val text)`);

  await d.run(`create table if not exists session (id text not null primary key, created_at number not null, expire_at number not null)`);

  await d.run(`create table if not exists group_values (group_href text not null primary key, vals text not null)`);

  return null;
}
