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

  db.run(
    `CREATE TABLE ShelfContent (
      ShelfName	TEXT,
      ContentId	TEXT,
      DateModified	TEXT,
      _IsDeleted	BOOL,
      _IsSynced	BOOL,
      PRIMARY KEY(ShelfName, ContentId)
    )`,
    (err) => {
      logger(err);
    }
  );

  db.run(
    `CREATE TABLE content( 		ContentID TEXT NOT NULL, 		ContentType TEXT NOT NULL, 		MimeType TEXT NOT NULL,		BookID TEXT,		BookTitle TEXT,		ImageId TEXT,		Title TEXT COLLATE NOCASE,		Attribution TEXT COLLATE NOCASE,		Description TEXT,		DateCreated TEXT,		ShortCoverKey TEXT,		adobe_location TEXT,		Publisher TEXT,		IsEncrypted BOOL,		DateLastRead TEXT,		FirstTimeReading BOOL,		ChapterIDBookmarked TEXT,		ParagraphBookmarked INTEGER,		BookmarkWordOffset INTEGER,		NumShortcovers INTEGER,		VolumeIndex INTEGER,		___NumPages INTEGER,		ReadStatus INTEGER,		___SyncTime TEXT,		___UserID TEXT NOT NULL, PublicationId TEXT, ___FileOffset INTEGER, ___FileSize INTEGER, ___PercentRead INTEGER, ___ExpirationStatus INTEGER, FavouritesIndex NOT NULL DEFAULT -1, Accessibility INTEGER DEFAULT 1, ContentURL TEXT, Language TEXT, BookshelfTags TEXT, IsDownloaded BIT NOT NULL DEFAULT 1, FeedbackType INTEGER DEFAULT 0, AverageRating INTEGER DEFAULT 0, Depth INTEGER, PageProgressDirection TEXT, InWishlist BOOL NOT NULL DEFAULT FALSE, ISBN TEXT, WishlistedDate TEXT DEFAULT "0000-00-00T00:00:00.000", FeedbackTypeSynced INTEGER DEFAULT 0, IsSocialEnabled BOOL NOT NULL DEFAULT TRUE, EpubType INT NOT NULL DEFAULT -1, Monetization INTEGER DEFAULT 2, ExternalId TEXT, Series TEXT, SeriesNumber TEXT, Subtitle TEXT, WordCount INTEGER DEFAULT -1, Fallback TEXT, RestOfBookEstimate INTEGER, CurrentChapterEstimate INTEGER, CurrentChapterProgress FLOAT, PocketStatus INTEGER DEFAULT 0, UnsyncedPocketChanges TEXT, ImageUrl TEXT, DateAdded TEXT, WorkId TEXT, Properties TEXT, RenditionSpread TEXT, RatingCount INTEGER DEFAULT 0, ReviewsSyncDate TEXT, MediaOverlay TEXT, MediaOverlayType TEXT, RedirectPreviewUrl TEXT, PreviewFileSize INTEGER, EntitlementId TEXT, CrossRevisionId TEXT, DownloadUrl TEXT, ReadStateSynced BIT NOT NULL DEFAULT false, TimesStartedReading INTEGER, TimeSpentReading INTEGER, LastTimeStartedReading TEXT, LastTimeFinishedReading TEXT, ApplicableSubscriptions TEXT, ExternalIds TEXT, PurchaseRevisionId TEXT, SeriesID TEXT, SeriesNumberFloat REAL, AdobeLoanExpiration TEXT, HideFromHomePage bit, IsInternetArchive BOOL NOT NULL DEFAULT FALSE, titleKana TEXT, subtitleKana TEXT, seriesKana TEXT, attributionKana TEXT, publisherKana TEXT, IsPurchaseable BOOL DEFAULT TRUE, IsSupported BOOL DEFAULT TRUE, AnnotationsSyncToken TEXT, DateModified TEXT DEFAULT "0000-00-00T00:00:00.000",		PRIMARY KEY (ContentID)		)
    `,
    (err) => {
      logger(err);
    }
  );
});

export default db;
