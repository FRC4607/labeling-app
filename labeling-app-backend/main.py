import sqlite3
import random
from flask import Flask, g, request
import base64
from flask_cors import CORS
import os.path

DB_PATH = "db.sqlite3"

app = Flask(__name__)
CORS(app)

@app.route("/ping")
def ping():
    return "pong"

def getDB():
    db = getattr(g, "_db", None)
    if db is None:
        db = g._db = sqlite3.connect(DB_PATH)
    return db

@app.teardown_appcontext
def closeDB(exception):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()

@app.route("/api/getTask")
def getTask():
    db = getDB()
    cur = db.cursor()
    cur.execute("SELECT id FROM imgs WHERE labeled != 1 AND unixepoch('now') - assignment > 300;")
    resList = cur.fetchall()
    if len(resList) == 0:
        return "No images available for labeling.", 409
    else:
        choice: str = random.choice(resList)[0]
        cur.execute("UPDATE imgs SET assignment=unixepoch('now') WHERE id=?", (choice, ))
        cur.connection.commit()
        with app.open_resource(f"imgs/{choice}.png", 'rb') as file:
            fileBytes = base64.b64encode(file.read())
        fileStr = f"data:image/png;base64,{fileBytes.decode('ascii')}"
        return {
            "imgId": choice,
            "data": fileStr
        }
    
@app.route("/api/submitLabels", methods=["POST"])
def submitLabels():
    labelObj: dict = request.json
    if ("imgId" in labelObj) and ("labels" in labelObj) and ("submitter" in labelObj):
        imgId: str = labelObj["imgId"]
        if (imgId.count("\\") + imgId.count("/")) > 0:
            return "", 418
        if not os.path.exists(f"imgs/{imgId}.png"):
            return "Invalid image ID.", 400
        db = getDB()
        cur = db.cursor()
        try:
            cur.execute("UPDATE imgs SET labeled=1, labeler=? WHERE id=?", (labelObj["submitter"], labelObj["imgId"]))
            lines: list = []
            for cls, boxes in enumerate(labelObj["labels"]):
                lines.extend([f"{cls} {box[0]} {box[1]} {box[2]} {box[3]}\n" for box in boxes])
            with open(f"labels/{imgId}.txt", "w") as f:
                if len(lines) == 0:
                    f.write("")
                else:
                    lines[-1] = lines[-1][:-1]
                    f.writelines(lines)
            return ""
        except:
            return "Error processing, check JSON content.", 4000
    else:
        return "Invalid request JSON structure.", 400
