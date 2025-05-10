# Colosseum Hack ETH 
This is the repository for Conversational Agentic AI that can be customized for different institutions.

## Project Structure
```
concierge/
├── backend/
│   ├── src/
│   │   ├── llm/           # LangChain and Ollama integration
│   │   ├── websocket/     # WebSocket server
│   │   ├── config/        # Configuration files
│   │   ├── utils/         # Utility functions
│   │   └── tests/         # Test files
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/           # Static files
│   ├── styles/           # CSS and styling
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library configurations
│   └── app/              # Next.js app directory
└── .gitignore
```

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Language Model**: Ollama
- **LLM Framework**: LangChain
- **Real-time Communication**: WebSocket
- **Testing**: pytest (planned)

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Real-time Communication**: WebSocket Client

## Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- pnpm (recommended) or npm
- Ollama installed locally

### Backend Setup
1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   python src/main.py
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   pnpm install  # or npm install
   ```

2. Start the development server:
   ```bash
   pnpm dev  # or npm run dev
   ```

## Development Workflow

### Branch Strategy
- `main`: Project structure and documentation
- `feature/*`: Feature branches for implementation
  - `feature/ollama-langchain`: LangChain and Ollama integration
  - `feature/websocket`: WebSocket implementation
  - `feature/frontend`: Frontend implementation
