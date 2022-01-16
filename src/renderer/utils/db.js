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
      Text TEXT, 
      VolumeId TEXT, 
      DateCreated TEXT,
      Definition TEXT,
      PRIMARY KEY(Text))`,
    (err) => {
      logger(err);
    }
  );

  db.run(
    `CREATE TABLE Bookmark ( 
      BookmarkID TEXT NOT NULL, 
      VolumeID TEXT NOT NULL, 
      ContentID TEXT NOT NULL, 
      StartContainerPath TEXT NOT NULL, 
      StartContainerChildIndex INTEGER NOT NULL, 
      StartOffset INTEGER NOT NULL, 
      EndContainerPath TEXT NOT NULL, 
      EndContainerChildIndex INTEGER NOT NULL, 
      EndOffset INTEGER NOT NULL,
      Text TEXT,
      Annotation TEXT,
      ExtraAnnotationData BLOB,
      DateCreated TEXT,
      ChapterProgress REAL NOT NULL DEFAULT 0,
      Hidden BOOL NOT NULL DEFAULT 0,
      Version TEXT,
      DateModified TEXT,
      Creator TEXT,
      UUID TEXT,
      UserID TEXT,
      SyncTime TEXT,
      Published BIT default false,
      ContextString TEXT,
      Type TEXT,
      PRIMARY KEY (BookmarkID) )`,
    (err) => {
      logger(err);
    }
  );
});

export default db;
