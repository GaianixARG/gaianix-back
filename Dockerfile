FROM node:20

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Ejecutar la app
CMD ["npm", "run", "dev"]
