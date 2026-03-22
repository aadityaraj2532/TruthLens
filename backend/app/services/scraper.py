from newspaper import Article
from urllib.parse import urlparse
import asyncio

async def scrape_article_data(url: str) -> dict:
    """
    Scrapes the article using newspaper3k async wrapper for non-blocking I/O.
    Extracts cleaner text, authors, publish_date, and raw domain.
    """
    def _scrape():
        article = Article(url)
        article.download()
        article.parse()
        domain = urlparse(url).netloc.replace('www.', '')
        return {
            "title": article.title,
            "text": article.text[:10000],
            "authors": ", ".join(article.authors) if article.authors else None,
            "publish_date": article.publish_date,
            "domain": domain
        }
    
    try:
        data = await asyncio.to_thread(_scrape)
        return data
    except Exception as e:
        print(f"Scraper error: {e}")
        return None
