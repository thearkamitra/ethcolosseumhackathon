from typing import Dict, List, Optional
from llm.chain import LangChainManager
import json
from llm.config import OllamaConfig
from .language_utils import LanguageUtils, Language
from .tools import (
    create_faq_tool,
    create_department_tool,
    create_calendar_tool,
    create_policy_tool,
    create_claim_tool
)

class InsuranceAgent:
    def __init__(self, config: Optional[OllamaConfig] = None):
        self.config = config or OllamaConfig(model_name="llama3.2")
        with open("src/data/institute_1.json", "r") as file:
            self.data = json.load(file)
        self.faq_tool = create_faq_tool(self.data["faqs"])
        self.department_tool = create_department_tool(self.data["departments"])
        self.calendar_tool = create_calendar_tool()
        self.policy_tool = create_policy_tool(self.data["policies"])
        self.claim_tool = create_claim_tool(self.data)
        self.language_utils = LanguageUtils()
        self.executer = LangChainManager(config=self.config, tools=[
            self.faq_tool,
            self.department_tool,
            self.calendar_tool,
            self.policy_tool,
            self.claim_tool
        ])
        
    # async def get_multilingual_response(self, question: str, languages: List[str] = None) -> Dict:
    #     """Get responses in multiple languages for the same question."""
    #     if languages is None:
    #         languages = ["en", "de", "fr", "it"]  # Default to major European languages
            
    #     responses = {}
    #     for lang in languages:
    #         response = await self.answer_insurance_questions(question, language=lang)
    #         responses[lang] = response["answer"]
            
    #     return self.language_utils.format_multilingual_response(responses)
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return list(self.language_utils.supported_languages.keys()) 