FROM python:3.11
WORKDIR /app

# requirements dosyasını özel olarak belirt
COPY backend/requirements.txt backend/requirements.txt

# requirements içeriğini yükle
RUN pip install -r backend/requirements.txt

# geri kalan tüm dosyaları kopyala
COPY . .

# Uvicorn ile çalıştır (uyarlayabilirsin)
CMD ["uvicorn", "backend.backend:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
