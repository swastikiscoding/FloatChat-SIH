FROM python:3.11
WORKDIR /app
COPY pyproject.toml* requirements.txt* ./
RUN pip install --no-cache-dir -r requirements.txt || true
COPY . .
CMD ["uv", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
