import fse from "fs-extra";
import path from "path";
import sq3 from "sqlite3";
import logger from "./logger";
import { docDir } from "./settings";

export const dbPath = path.join(docDir, "KoboExporter.sqlite");

fse.ensureFileSync(dbPath);

const sqlite3 = sq3.verbose();
let db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE WordList( 
      Text  TEXT, 
      VolumeId TEXT, 
      DateCreated TEXT,
      Definition TEXT,
      PRIMARY KEY(Text))`,
    (err) => {
      logger(err);
    }
  );
});

export default db;
