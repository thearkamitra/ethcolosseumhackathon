from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
import requests
import json

class SearchInput(BaseModel):
    query: str = Field(description="The search query to look up")

class WebSearchTool(BaseTool):
    name = "web_search"
    description = "Useful for searching the web for current information"
    args_schema: Type[BaseModel] = SearchInput

    def _run(self, query: str) -> str:
        # This is a placeholder - in a real implementation, you'd use a proper search API
        return f"Search results for: {query}"

    async def _arun(self, query: str) -> str:
        return self._run(query)

class CalculatorInput(BaseModel):
    expression: str = Field(description="The mathematical expression to evaluate")

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Useful for performing mathematical calculations"
    args_schema: Type[BaseModel] = CalculatorInput

    def _run(self, expression: str) -> str:
        try:
            # Basic safety check - in production, use a proper safe eval
            allowed_chars = set("0123456789+-*/(). ")
            if not all(c in allowed_chars for c in expression):
                return "Invalid expression"
            result = eval(expression)
            return str(result)
        except Exception as e:
            return f"Error calculating: {str(e)}"

    async def _arun(self, expression: str) -> str:
        return self._run(expression)

def get_default_tools():
    """Return a list of default tools for the agent"""
    return [
        WebSearchTool(),
        CalculatorTool()
    ] 