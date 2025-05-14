# Dockerfile
FROM python:3.11-slim

# Ustaw zmienną środowiskową
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Tworzymy katalog roboczy
WORKDIR /app

# Kopiujemy pliki projektu
COPY . /app

# Instalujemy zależności
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Otwieramy port
EXPOSE 5000

# Uruchamiamy aplikację
CMD ["python", "app.py"]

