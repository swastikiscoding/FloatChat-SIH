# FloatChat FastAPI Server

## Running the server

To run the FastAPI server, use the following command from the project root:

```powershell
uv run -m app.main
```

This ensures Python can resolve the `app` package correctly and avoids `ModuleNotFoundError: No module named 'app'`.


## Running other scripts

To run other scripts (such as services or utilities) and avoid import errors, always use the `-m` flag from the project root. For example:

```powershell
python -m app.services.chatbot
```

This ensures all imports work as expected. Avoid running scripts directly (e.g., `python app/services/chatbot.py`) as it may cause `ModuleNotFoundError` for package imports.

If you encounter import errors, you can also try setting the `PYTHONPATH` environment variable:

```powershell
$env:PYTHONPATH="."; python app/services/chatbot.py
```

But the first method is recommended for most cases.
