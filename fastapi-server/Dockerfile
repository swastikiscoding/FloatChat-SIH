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
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]