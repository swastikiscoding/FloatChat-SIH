FROM python:3.11
WORKDIR /app
# Install uv package manager
RUN pip install --no-cache-dir uv
# Copy dependency files for uv
COPY pyproject.toml* uv.lock* ./
# Install dependencies using uv
RUN uv pip install --system --no-cache-dir
# Copy the rest of the application
COPY . .
# uvicorn doesn't run directly for me... but this should work
CMD ["uv", "run", "-m", "app.main"]