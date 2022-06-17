import path from "path";
import { getDB } from "../db";
const fs = require('fs/promises');
var slugify = require('slugify');

export interface Group {
  title: string;
  filename: string;
  href: string;
  index: number;
}

export class Schema {
  public groups = [] as Group[];
}

export async function setValue(groupHref: string, itemName: string, itemValue: any) {
  let values: { [k: string]: any } = await loadValues(groupHref);

  // with
  values[itemName] = itemValue;

  const marshaled = JSON.stringify(values);

  const db = await getDB();
  await db.run(`replace into group_values (group_href, vals) values ($1, $2)`, groupHref, marshaled);
}

export async function loadValues(groupHref: string): Promise<Object> {
  const db = await getDB();
  const values = await db.get(`select vals from group_values where group_href = $1`, groupHref)
  if (!values) {
    return {};
  }

  const parsed = JSON.parse(values.vals);
  return parsed;
}

export async function loadDefaults(groupHref: string): Promise<Object> {
  console.log("asdasd2");
  const schema = await loadSchema();
  for (const group of schema.groups) {
    if (group.href === groupHref) {
      const data = await fs.readFile(group.filename);
      console.log(JSON.parse(data));
    }
  }

  return {};
}

export async function loadSchema(): Promise<Schema> {
  const configDir = process.env.FIRSTRUN_CONFIG_PATH ?
    process.env.FIRSTRUN_CONFIG_PATH :
    "/firstrun";

  const files = await getFilesFromDirectory(configDir);

  const schema = new Schema();
  let i = 0;
  const groups = await Promise.all(files.map(async (file): Promise<Group> => {
    const data = await fs.readFile(file);
    const group = JSON.parse(data);

    group.filename = file;
    group.href = slugify(group.title).toLowerCase();
    group.index = i;

    i++;

    return group;
  }));
  schema.groups = groups;

  return schema;
}

const getFilesFromDirectory = async (dir: string) => {
  const filesInDirectory = await fs.readdir(dir);
  const files = await Promise.all(
    filesInDirectory.map(async (file: string) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);

        if (!stats.isDirectory()) {
            return filePath;
        }
    })
  );
  const cleaned = files.filter((file) => files.length); // return with empty arrays removed
  const again = cleaned.filter((file) => file);

  return again;
};
