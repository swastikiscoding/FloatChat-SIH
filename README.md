# FloatChat - AI-Powered Conversational Interface for ARGO Ocean Data Discovery and Visualization

A comprehensive platform for oceanographic researchers to visualize Argo float data and interact with an AI assistant specialized in marine science.

## Technology Stack

- **[React](https://vitejs.dev):** Modern frontend framework for building responsive user interfaces
- **[Node.js + Express](https://nodejs.org):** Backend server for API routing and data management  
- **[FastAPI + Python](https://fastapi.tiangolo.com):** High-performance API for AI chatbot and data processing
- **[Docker](https://docker.com):** Containerization for consistent deployment across environments
- **[Tailwind CSS](https://tailwindcss.com):** Utility-first CSS framework for rapid UI development
- **[OpenAI API](https://openai.com):** Powers the intelligent oceanographic chatbot assistant

## Key Features

- **Interactive Globe Visualization:** 3D visualization of oceanographic data with date-based filtering
- **AI-Powered Chatbot:** Specialized assistant for oceanographic research queries and data analysis
- **Real-time Data Access:** Integration with ERDDAP and ArgoVis APIs for live oceanographic data
- **Multi-user Authentication:** Secure user management with Clerk integration

## Local Setup Instructions

#### Prerequisites
- Node.js 18+ and npm
- Python 3.13+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

**Windows:**
```cmd
# Install dependencies for all services
cd client
npm install
cd ..\nodejs-server
npm install
cd ..\fastapi-server
uv sync
cd ..

# Start services (run each in separate terminals)
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - Node.js Backend  
cd nodejs-server
npm run dev

# Terminal 3 - FastAPI Backend
cd fastapi-server
uv run -m app.main
```

**macOS/Linux:**
```bash
# Install dependencies for all services
cd client && npm install && cd ..
cd nodejs-server && npm install && cd ..
cd fastapi-server && uv sync && cd ..

# Start services (run each in separate terminals)
# Terminal 1 - Frontend
cd client && npm run dev

# Terminal 2 - Node.js Backend
cd nodejs-server && npm run dev

# Terminal 3 - FastAPI Backend  
cd fastapi-server && uv run -m app.main
```

#### Access Points (Development Mode)
- Frontend: http://localhost:5173
- Node.js API: http://localhost:3000
- FastAPI: http://localhost:8000
