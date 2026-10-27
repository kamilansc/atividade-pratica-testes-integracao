import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function criarBancoDeTeste() {
    const db = new Database(":memory:");
    const schema = readFileSync(join(process.cwd(), "database", "schema.sql"), "utf8");

    db.exec(schema);

    return db;
}