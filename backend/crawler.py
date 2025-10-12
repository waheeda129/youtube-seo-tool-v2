# crawler.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def crawl_youtube(keyword):
    # Set up Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        url = f"https://www.youtube.com/results?search_query={keyword}"
        driver.get(url)

        # Wait for the page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "contents"))
        )

        # Scroll down to load more videos
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            time.sleep(2)

        # Find video elements
        videos = driver.find_elements(By.CSS_SELECTOR, "ytd-video-renderer")

        results = []
        for video in videos[:10]:  # Limit to first 10 videos
            try:
                title_elem = video.find_element(By.CSS_SELECTOR, "#video-title")
                title = title_elem.get_attribute("title")

                channel_elem = video.find_element(By.CSS_SELECTOR, "#channel-name #text")
                channel = channel_elem.text

                # Try different selectors for views and date
                try:
                    metadata_spans = video.find_elements(By.CSS_SELECTOR, "#metadata-line span")
                    if len(metadata_spans) >= 2:
                        views = metadata_spans[0].text
                        publish_date = metadata_spans[1].text
                    else:
                        views = "N/A"
                        publish_date = "N/A"
                except:
                    views = "N/A"
                    publish_date = "N/A"

                # Get description if available
                try:
                    desc_elem = video.find_element(By.CSS_SELECTOR, "#description-text")
                    description = desc_elem.text
                except:
                    description = ""

                # Get likes (this might not be available without clicking)
                likes = "N/A"

                # Get tags (not easily available from search results)
                tags = ""

                results.append({
                    "title": title,
                    "channel": channel,
                    "views": views,
                    "publish_date": publish_date,
                    "description": description,
                    "likes": likes,
                    "tags": tags
                })

            except Exception as e:
                print(f"Error extracting data from video: {e}")
                continue

        return results

    finally:
        driver.quit()
