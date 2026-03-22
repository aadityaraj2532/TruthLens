from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ArticleRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None

class ArticleResponse(BaseModel):
    id: int
    url: Optional[str]
    title: str
    author: Optional[str]
    publish_date: Optional[datetime]
    
    credibility_score: float
    ai_verdict: str
    explanation: str
    risk_level: str
    source_reliability: float
    sensational_words: List[str] = []
    biased_words: List[str] = []
    
    analyzed_at: datetime

    class Config:
        from_attributes = True
