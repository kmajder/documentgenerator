FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy files
COPY main.py ./main.py
COPY templates/ ./templates/

# Install FastAPI and Uvicorn
RUN pip install fastapi uvicorn

# Expose port
EXPOSE 8000

# Run the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

