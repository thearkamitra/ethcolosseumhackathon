from langchain.tools import Tool

def create_faq_tool(data):
    def answer_faq(query: str) -> str:
        for faq in data["faqs"]:
            if faq["question"].lower() in query.lower():
                return faq["answer"]
        return "This case needs other advice. A report has been initiated and someone should reach out later."

    return Tool.from_function(
        name="faq_tool",
        func=answer_faq,
        description="Answers frequently asked questions about the insurance company."
    )

def create_department_tool(data):
    def find_department(query: str) -> str:
        for dept in data["departments"]:
            if dept["name"].lower() in query.lower() or dept["specialization"].lower() in query.lower():
                people = ", ".join(dept["personnel"])
                return f"{dept['name']} department specializes in {dept['specialization']}. Available personnel: {people}."
        return "This case needs other advice. A report has been initiated and someone should reach out later."

    return Tool.from_function(
        name="department_tool",
        func=find_department,
        description="Finds information about departments and staff availability."
    )


def create_calendar_tool():
    def manage_calendar(query: str) -> str:
        if "book" in query.lower():
            return "Appointment successfully booked. You will receive a confirmation email shortly."
        elif "reschedule" in query.lower():
            return "Your appointment has been rescheduled. Please check your calendar for the updated time."
        else:
            return "This case needs other advice. A report has been initiated and someone should reach out later."

    return Tool.from_function(
        name="calendar_tool",
        func=manage_calendar,
        description="Handles booking or rescheduling calendar appointments."
    )


def create_policy_tool(data):
    def get_policy_info(query: str) -> str:
        for policy in data["policies"]:
            if policy["name"].lower() in query.lower():
                return f"{policy['name']}: {policy['details']}"
        return "This case needs other advice. A report has been initiated and someone should reach out later."

    return Tool.from_function(
        name="policy_tool",
        func=get_policy_info,
        description="Provides detailed information about a particular insurance policy."
    )


def create_claim_tool(data):
    def process_claim(query: str) -> str:
        if "file" in query.lower():
            return "Your claim has been filed successfully. You will receive a confirmation email shortly."
        elif "status" in query.lower():
            return "Your claim is currently under review. You will be notified once a decision has been made."
        else:
            return "This case needs other advice. A report has been initiated and someone should reach out later."

    return Tool.from_function(
        name="claim_tool",
        func=process_claim,
        description="Handles filing or checking the status of insurance claims."
    )

