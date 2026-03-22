from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from datetime import datetime
from app.core.database import Base

class ArticleAnalysis(Base):
    __tablename__ = "article_analysis"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True, nullable=True)
    title = Column(String, index=True, default="Unknown Title")
    author = Column(String, nullable=True)
    publish_date = Column(DateTime, nullable=True)
    content = Column(Text)
    
    credibility_score = Column(Float)
    source_reliability = Column(Float, nullable=True)
    ai_verdict = Column(String)
    risk_level = Column(String)
    explanation = Column(Text)
    sensational_words = Column(JSON, default=[])
    biased_words = Column(JSON, default=[])
    
    analyzed_at = Column(DateTime, default=datetime.utcnow)
