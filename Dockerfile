FROM node:26-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Dar permisos de ejecución a nodemon (y a todos los binarios)
RUN chmod +x node_modules/.bin/*

# Exponer el puerto
EXPOSE 5000

# Ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]
