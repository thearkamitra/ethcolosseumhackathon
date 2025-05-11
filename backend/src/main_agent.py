from src.insurance.insurance_agent import InsuranceAgent


def main():

    agent = InsuranceAgent()

    print("Welcome to the Insurance Agent. Type 'exit' to quit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        try:
            response = agent.run(user_input)
            print(f"Agent: {response}")
        except Exception as e:
            print(f"Agent Error: {e}")

if __name__ == "__main__":
    main()
