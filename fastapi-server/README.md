# FloatChat FastAPI Server

## Running the server

To run the FastAPI server, or any file in the app for that matter, use the following command from the project root:

```powershell
cd .\fastapi-server\
uv run -m app.main
```

This ensures Python can resolve the `app` package correctly and avoids `ModuleNotFoundError: No module named 'app'`.