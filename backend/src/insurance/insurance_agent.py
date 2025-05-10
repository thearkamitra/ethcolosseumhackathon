from typing import Dict, List, Optional
from llm.chain import LangChainManager
from llm.config import OllamaConfig
from .language_utils import LanguageUtils, Language

class InsuranceAgent:
    def __init__(self, config: Optional[OllamaConfig] = None):
        self.config = config or OllamaConfig(model_name="llama3.2")
        self.manager = LangChainManager(config=self.config)
        self.language_utils = LanguageUtils()
        
    async def analyze_insurance_policy(self, policy_text: str, language: str = "en") -> Dict:
        """Analyze an insurance policy and extract key information in the specified language."""
        base_prompt = f"""Analyze the following insurance policy and extract key information:
        {policy_text}
        
        Please provide:
        1. Coverage details
        2. Exclusions
        3. Premium information
        4. Policy terms
        5. Risk assessment
        """
        prompt = self.language_utils.get_language_prompt(language, base_prompt)
        response = await self.manager.generate_response(prompt)
        return {"analysis": response, "language": language}
    
    async def compare_policies(self, policy1: str, policy2: str, language: str = "en") -> Dict:
        """Compare two insurance policies and highlight differences in the specified language."""
        base_prompt = f"""Compare these two insurance policies and highlight key differences:
        Policy 1:
        {policy1}
        
        Policy 2:
        {policy2}
        
        Focus on:
        1. Coverage differences
        2. Cost differences
        3. Terms and conditions
        4. Risk factors
        """
        prompt = self.language_utils.get_language_prompt(language, base_prompt)
        response = await self.manager.generate_response(prompt)
        return {"comparison": response, "language": language}
    
    async def generate_risk_assessment(self, client_info: Dict, language: str = "en") -> Dict:
        """Generate a risk assessment based on client information in the specified language."""
        base_prompt = f"""Based on the following client information, provide a risk assessment:
        {client_info}
        
        Consider:
        1. Risk factors
        2. Recommended coverage
        3. Premium suggestions
        4. Risk mitigation strategies
        """
        prompt = self.language_utils.get_language_prompt(language, base_prompt)
        response = await self.manager.generate_response(prompt)
        return {"risk_assessment": response, "language": language}
    
    async def answer_insurance_questions(self, question: str, language: str = "en", context: Optional[str] = None) -> Dict:
        """Answer insurance-related questions in the specified language."""
        base_prompt = f"""Answer the following insurance question:
        Question: {question}
        
        {f'Context: {context}' if context else ''}
        
        Provide a clear, accurate, and helpful response based on insurance best practices.
        """
        prompt = self.language_utils.get_language_prompt(language, base_prompt)
        response = await self.manager.generate_response(prompt)
        return {"answer": response, "language": language}
    
    async def get_multilingual_response(self, question: str, languages: List[str] = None) -> Dict:
        """Get responses in multiple languages for the same question."""
        if languages is None:
            languages = ["en", "de", "fr", "it"]  # Default to major European languages
            
        responses = {}
        for lang in languages:
            response = await self.answer_insurance_questions(question, language=lang)
            responses[lang] = response["answer"]
            
        return self.language_utils.format_multilingual_response(responses)
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return list(self.language_utils.supported_languages.keys()) 