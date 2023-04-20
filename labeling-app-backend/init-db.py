import sqlite3

table = """CREATE TABLE "imgs" (
	"id" TEXT NOT NULL,
	"assignment" INTEGER NULL DEFAULT NULL,
	"labeler" TEXT NULL,
	"labeled" INTEGER NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);"""

db = sqlite3.connect("db.sqlite3")
cur = db.cursor()
cur.executescript(table)
cur.connection.commit()