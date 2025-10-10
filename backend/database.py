import sqlite3

def create_table():
    conn = sqlite3.connect("ytboost.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keyword TEXT,
            title TEXT,
            description TEXT,
            views TEXT,
            likes TEXT,
            publish_date TEXT,
            channel TEXT,
            tags TEXT
        )
    ''')
    conn.commit()
    conn.close()

def insert_video(data):
    conn = sqlite3.connect("ytboost.db")
    c = conn.cursor()
    c.execute('''
        INSERT INTO videos (keyword, title, description, views, likes, publish_date, channel, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', data)
    conn.commit()
    conn.close()
