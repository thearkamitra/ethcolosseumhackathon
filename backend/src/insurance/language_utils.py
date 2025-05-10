from typing import Dict, Optional
from enum import Enum
import json
from langdetect import detect

class Language(Enum):
    ENGLISH = "en"
    GERMAN = "de"
    FRENCH = "fr"
    ITALIAN = "it"
    SPANISH = "es"
    DUTCH = "nl"
    CHINESE_SIMPLIFIED = "zh-CN"
    CHINESE_TRADITIONAL = "zh-TW"

class LanguageUtils:
    def __init__(self):
        self.supported_languages = {
            lang.value: lang.name for lang in Language
        }
        
        # Comprehensive insurance terms in different languages
        self.insurance_terms = {
            "en": {
                "coverage": "coverage",
                "premium": "premium",
                "deductible": "deductible",
                "policy": "policy",
                "claim": "claim",
                "risk": "risk",
                "liability": "liability",
                "benefit": "benefit",
                "exclusion": "exclusion",
                "endorsement": "endorsement"
            },
            "de": {
                "coverage": "Deckung",
                "premium": "Prämie",
                "deductible": "Selbstbehalt",
                "policy": "Police",
                "claim": "Schadensfall",
                "risk": "Risiko",
                "liability": "Haftung",
                "benefit": "Leistung",
                "exclusion": "Ausschluss",
                "endorsement": "Zusatzvereinbarung"
            },
            "fr": {
                "coverage": "couverture",
                "premium": "prime",
                "deductible": "franchise",
                "policy": "police",
                "claim": "sinistre",
                "risk": "risque",
                "liability": "responsabilité",
                "benefit": "prestation",
                "exclusion": "exclusion",
                "endorsement": "avenant"
            },
            "it": {
                "coverage": "copertura",
                "premium": "premio",
                "deductible": "franchigia",
                "policy": "polizza",
                "claim": "sinistro",
                "risk": "rischio",
                "liability": "responsabilità",
                "benefit": "prestazione",
                "exclusion": "esclusione",
                "endorsement": "endorsement"
            },
            "zh-CN": {
                "coverage": "保障",
                "premium": "保费",
                "deductible": "免赔额",
                "policy": "保单",
                "claim": "理赔",
                "risk": "风险",
                "liability": "责任",
                "benefit": "福利",
                "exclusion": "除外",
                "endorsement": "批单"
            },
            "zh-TW": {
                "coverage": "保障",
                "premium": "保費",
                "deductible": "免賠額",
                "policy": "保單",
                "claim": "理賠",
                "risk": "風險",
                "liability": "責任",
                "benefit": "福利",
                "exclusion": "除外",
                "endorsement": "批單"
            }
        }

    def get_language_prompt(self, language: str, content: str) -> str:
        """Generate a prompt in the specified language."""
        language_prompts = {
            "en": "Please provide the response in English.",
            "de": "Bitte geben Sie die Antwort auf Deutsch.",
            "fr": "Veuillez fournir la réponse en français.",
            "it": "Si prega di fornire la risposta in italiano.",
            "zh-CN": "请用简体中文提供回答。",
            "zh-TW": "請用繁體中文提供回答。"
        }
        
        return f"{content}\n\n{language_prompts.get(language, language_prompts['en'])}"

    def translate_insurance_terms(self, text: str, from_lang: str, to_lang: str) -> str:
        """Translate insurance-specific terms between languages."""
        if from_lang not in self.insurance_terms or to_lang not in self.insurance_terms:
            return text
            
        from_terms = self.insurance_terms[from_lang]
        to_terms = self.insurance_terms[to_lang]
        
        translated_text = text
        for term, translation in from_terms.items():
            if term in to_terms:
                translated_text = translated_text.replace(term, to_terms[term])
                
        return translated_text

    def detect_language(self, text: str) -> str:
        """Detect the language of the input text using langdetect."""
        try:
            return detect(text)
        except:
            return "en"  # Default to English if detection fails

    def format_multilingual_response(self, responses: Dict[str, str]) -> Dict[str, str]:
        """Format responses in multiple languages."""
        return {
            "responses": responses,
            "available_languages": list(self.supported_languages.keys())
        }

    def format_currency(self, amount: float, language: str) -> str:
        """Format currency based on language."""
        currency_formats = {
            "en": f"${amount:,.2f}",
            "de": f"{amount:,.2f} €",
            "fr": f"{amount:,.2f} €",
            "it": f"{amount:,.2f} €",
            "zh-CN": f"¥{amount:,.2f}",
            "zh-TW": f"¥{amount:,.2f}"
        }
        return currency_formats.get(language, f"${amount:,.2f}")

    def format_number(self, number: float, language: str) -> str:
        """Format number based on language."""
        number_formats = {
            "en": f"{number:,.2f}",
            "de": f"{number:,.2f}".replace(",", " ").replace(".", ","),
            "fr": f"{number:,.2f}".replace(",", " ").replace(".", ","),
            "it": f"{number:,.2f}".replace(",", " ").replace(".", ","),
            "zh-CN": f"{number:,.2f}",
            "zh-TW": f"{number:,.2f}"
        }
        return number_formats.get(language, f"{number:,.2f}") 