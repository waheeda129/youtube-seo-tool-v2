from flask import Flask, request, jsonify
from crawler import crawl_youtube
from database import create_table

app = Flask(__name__)

@app.route("/crawl", methods=["GET"])
def crawl():
    keyword = request.args.get("keyword")
    if not keyword:
        return jsonify({"error": "Keyword required"}), 400

    titles = crawl_youtube(keyword)
    return jsonify({"keyword": keyword, "results": titles})

if __name__ == "__main__":
    create_table()
    print("🚀 Flask server starting on http://127.0.0.1:5000 ...")  # 👈 Added this line
    app.run(debug=True)
