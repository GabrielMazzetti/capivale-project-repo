# Use a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de manifesto de pacotes
COPY package*.json ./

# Remove a pasta node_modules se existir e instala as dependências
RUN rm -rf node_modules && npm install

# Copia o restante do código da aplicação
COPY . .

# Cria o diretório dist explicitamente (garante que ele exista)
RUN mkdir -p dist # Added this line

# Compila o código TypeScript para JavaScript
RUN npm run build # Added build step

# Expõe a porta que a aplicação vai rodar
EXPOSE 3001

# Comando para iniciar a aplicação em modo de produção (executa o código compilado)
CMD [ "npm", "start" ]
