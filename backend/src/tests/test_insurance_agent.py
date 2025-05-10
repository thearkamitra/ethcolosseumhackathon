import asyncio
from insurance.insurance_agent import InsuranceAgent

async def test_insurance_agent():
    # Initialize the insurance agent
    agent = InsuranceAgent()
    
    # Test policy analysis in different languages
    print("\nTesting policy analysis in multiple languages...")
    sample_policy = """
    Insurance Policy for Home Coverage
    Coverage: €500,000
    Premium: €1,200 annually
    Deductible: €1,000
    Coverage includes: Fire, theft, natural disasters
    Exclusions: Flood damage, war damage
    """
    
    languages = ["en", "de", "fr", "it", "zh-CN", "zh-TW"]
    for lang in languages:
        try:
            print(f"\nAnalyzing policy in {lang}...")
            analysis = await agent.analyze_insurance_policy(sample_policy, language=lang)
            print(f"Policy Analysis ({lang}):", analysis["analysis"])
        except Exception as e:
            print(f"Error analyzing policy in {lang}:", str(e))
    
    # Test multilingual question answering
    print("\nTesting multilingual question answering...")
    question = "What factors affect my home insurance premium in Switzerland?"
    try:
        multilingual_response = await agent.get_multilingual_response(question)
        print("\nMultilingual Responses:")
        for lang, response in multilingual_response["responses"].items():
            print(f"\n{lang.upper()}:", response)
    except Exception as e:
        print("Error getting multilingual response:", str(e))
    
    # Test risk assessment in German
    print("\nTesting risk assessment in German...")
    client_info = {
        "age": 35,
        "occupation": "Software Engineer",
        "location": "Zurich",
        "property_value": "€750,000",
        "previous_claims": 0
    }
    try:
        assessment = await agent.generate_risk_assessment(client_info, language="de")
        print("Risk Assessment (DE):", assessment["risk_assessment"])
    except Exception as e:
        print("Error generating risk assessment:", str(e))
    
    # Print supported languages
    print("\nSupported Languages:", agent.get_supported_languages())

if __name__ == "__main__":
    asyncio.run(test_insurance_agent()) 