# Expo CLI içeren bir Node ortamı
FROM node:18

# Uygulama dizinine geç
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm install


COPY .env.docker .env

# Proje dosyalarını kopyala
COPY . .


# Gerekli portları aç
EXPOSE 8081 19000 19001 19002

# Metro Bundler ve Web başlat
CMD ["npx", "expo", "start", "--web"]
