from flask import Flask, request, jsonify
from crawler import crawl_youtube
from database import create_table, insert_video

app = Flask(__name__)

@app.route("/crawl", methods=["GET"])
def crawl():
    keyword = request.args.get("keyword")
    if not keyword:
        return jsonify({"error": "Keyword required"}), 400

    videos = crawl_youtube(keyword)

    # Insert each video into the database
    for video in videos:
        data = (
            keyword,
            video["title"],
            video["description"],
            video["views"],
            video["likes"],
            video["publish_date"],
            video["channel"],
            video["tags"]
        )
        insert_video(data)

    return jsonify({"keyword": keyword, "results": videos, "count": len(videos)})

if __name__ == "__main__":
    create_table()
    print("Flask server starting on http://127.0.0.1:5000 ...")
    app.run(debug=True)
