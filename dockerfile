# Use uma imagem base do Python
FROM python:3.12.9-slim

# Instale dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Atualize o pip
RUN pip install --upgrade pip

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos antes de instalar as dependências (melhora cache)
COPY requirements.txt .

# Instale as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie o restante do código
COPY . .

# 🔹 Criar a pasta "imgs" dentro do contêiner
RUN mkdir -p /app/imgs

# 🔹 Garantir permissões para escrita na pasta "imgs"
RUN chmod -R 777 /app/imgs

# Exponha a porta do Flask
EXPOSE 5000

# Comando para rodar o aplicativo
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
