from langchain.tools import Tool
from typing import Dict, Any

def create_faq_tool(data: Dict[str, Any]) -> Tool:
    def answer_faq(query: str) -> str:
        if not isinstance(data, dict) or "faqs" not in data:
            return "I apologize, but I cannot access the FAQ database at the moment."
            
        for faq in data["faqs"]:
            if isinstance(faq, dict) and "question" in faq and "answer" in faq:
                if faq["question"].lower() in query.lower():
                    return faq["answer"]
        return "I couldn't find a specific answer to your question. Would you like me to connect you with a human agent?"

    return Tool.from_function(
        name="faq_tool",
        func=answer_faq,
        description="Answers frequently asked questions about the insurance company."
    )

def create_department_tool(data: Dict[str, Any]) -> Tool:
    def find_department(query: str) -> str:
        if not isinstance(data, dict) or "departments" not in data:
            return "I apologize, but I cannot access the department database at the moment."
            
        for dept in data["departments"]:
            if isinstance(dept, dict) and "name" in dept and "specialization" in dept:
                if dept["name"].lower() in query.lower() or dept["specialization"].lower() in query.lower():
                    people = ", ".join(dept.get("personnel", []))
                    return f"{dept['name']} department specializes in {dept['specialization']}. Available personnel: {people}."
        return "I couldn't find information about that department. Would you like me to connect you with a human agent?"

    return Tool.from_function(
        name="department_tool",
        func=find_department,
        description="Finds information about departments and staff availability."
    )

def create_calendar_tool() -> Tool:
    def manage_calendar(query: str) -> str:
        if "book" in query.lower():
            return "Appointment successfully booked. You will receive a confirmation email shortly."
        elif "reschedule" in query.lower():
            return "Your appointment has been rescheduled. Please check your calendar for the updated time."
        else:
            return "I can help you book or reschedule appointments. Would you like to do either of those?"

    return Tool.from_function(
        name="calendar_tool",
        func=manage_calendar,
        description="Handles booking or rescheduling calendar appointments."
    )

def create_policy_tool(data: Dict[str, Any]) -> Tool:
    def get_policy_info(query: str) -> str:
        if not isinstance(data, dict) or "policies" not in data:
            return "I apologize, but I cannot access the policy database at the moment."
            
        for policy in data["policies"]:
            if isinstance(policy, dict) and "name" in policy and "details" in policy:
                if policy["name"].lower() in query.lower():
                    return f"{policy['name']}: {policy['details']}"
        return "I couldn't find information about that policy. Would you like me to connect you with a human agent?"

    return Tool.from_function(
        name="policy_tool",
        func=get_policy_info,
        description="Provides detailed information about a particular insurance policy."
    )

def create_claim_tool(data: Dict[str, Any]) -> Tool:
    def process_claim(query: str) -> str:
        if "file" in query.lower():
            return "Your claim has been filed successfully. You will receive a confirmation email shortly."
        elif "status" in query.lower():
            return "Your claim is currently under review. You will be notified once a decision has been made."
        else:
            return "I can help you file a new claim or check the status of an existing claim. What would you like to do?"

    return Tool.from_function(
        name="claim_tool",
        func=process_claim,
        description="Handles filing or checking the status of insurance claims."
    )

