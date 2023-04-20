import sqlite3
import os

db = sqlite3.connect("db.sqlite3")
cur = db.cursor()
cur.execute("SELECT id FROM imgs")
existing_ids = [i[0] for i in cur.fetchall()]
entries = []
for img in os.listdir("imgs"):
    imgName = img.split(".")[0]
    if imgName not in existing_ids:
        entries.append((imgName, 0, "", 0))
cur.executemany("INSERT INTO imgs VALUES(?, ?, ?, ?)", entries)
cur.connection.commit()