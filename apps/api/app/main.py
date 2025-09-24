from fastapi import FastAPI

app = FastAPI(title="PIN-Kings API")


@app.get("/health")
def read_health() -> dict[str, str]:
    """Basic health endpoint to verify the API is running."""
    return {"status": "ok"}
