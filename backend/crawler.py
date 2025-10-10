# crawler.py
import requests
from bs4 import BeautifulSoup

def crawl_youtube(keyword):
    url = f"https://www.youtube.com/results?search_query={keyword}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    # YouTube page HTML ab JS se load hoti hai, isliye old tags empty milte hain.
    # Par test ke liye dummy data return karte hain
    titles = [f"Test video about {keyword}", f"Another {keyword} tutorial"]

    return titles
