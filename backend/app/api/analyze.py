from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.logger import logger
from app.core.security import limiter
from app.models.schemas import ArticleRequest, ArticleResponse
from app.models.article_model import ArticleAnalysis
from app.services.scraper import scrape_article_data
from app.services.ai_engine import analyze_news_content

router = APIRouter()

@router.post("/analyze", response_model=ArticleResponse)
@limiter.limit("5/minute")
async def analyze_article(request: Request, body: ArticleRequest, db: Session = Depends(get_db)):
    """
    Analyzes an article based on a provided URL or raw text.
    Implements intelligent caching, async I/O, rate limiting, and structured logging.
    """
    if body.url:
        logger.info(f"Checking Cache for URL: {body.url}")
        existing = db.query(ArticleAnalysis).filter(ArticleAnalysis.url == body.url).first()
        if existing:
            logger.info(f"Cache HIT [200]: Returning existing analysis for {body.url}")
            return existing
            
        logger.info(f"Cache MISS: No previous records found for {body.url}. Proceeding to scrape.")

    text_to_analyze = body.text
    title = "Provided User Text"
    author = None
    publish_date = None
    
    if body.url:
        logger.info(f"Initializing Async Scraper for: {body.url}")
        scraped_data = await scrape_article_data(body.url)
        if not scraped_data or not scraped_data.get("text"):
            logger.error(f"Scraper Error: Failed to extract valid article content from {body.url}")
            raise HTTPException(status_code=400, detail="Failed to extract article content.")
        
        text_to_analyze = scraped_data["text"]
        title = scraped_data.get("title", title)
        author = scraped_data.get("authors")
        publish_date = scraped_data.get("publish_date")
        logger.info(f"Scraper Success: Extracted context with length {len(text_to_analyze)}")
        
    if not text_to_analyze:
        logger.error("Validation Error: No text payload or valid URL provided.")
        raise HTTPException(status_code=400, detail="Must provide 'url' or 'text'.")
            
    logger.info("Invoking Groq AI Engine capability pipeline...")
    analysis_result = await analyze_news_content(text_to_analyze, body.url)
    
    logger.info("AI Inferencing Success. Persisting evaluation to database.")
    db_article = ArticleAnalysis(
        url=body.url,
        title=title,
        author=author,
        publish_date=publish_date,
        content=text_to_analyze,
        credibility_score=analysis_result["credibility_score"],
        source_reliability=analysis_result["source_reliability"],
        ai_verdict=analysis_result["ai_verdict"],
        risk_level=analysis_result["risk_level"],
        explanation=analysis_result["explanation"],
        sensational_words=analysis_result.get("sensational_words", []),
        biased_words=analysis_result.get("biased_words", [])
    )
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    logger.info(f"System Transaction Success: Evaluation recorded with Analysis ID: {db_article.id}")
    return db_article

@router.get("/history", response_model=list[ArticleResponse])
@limiter.limit("20/minute")
def get_analysis_history(request: Request, limit: int = 10, db: Session = Depends(get_db)):
    """Returns recently analyzed items."""
    logger.info(f"Dashboard Request: Retrieving recent history limit={limit}")
    return db.query(ArticleAnalysis).order_by(ArticleAnalysis.analyzed_at.desc()).limit(limit).all()
