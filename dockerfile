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

RUN mkdir -p /app/imgs

# Copie o arquivo requirements.txt para o contêiner
COPY requirements.txt /app/requirements.txt

COPY imgs /app/imgs

# Defina o diretório de trabalho
WORKDIR /app

# Instale as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie o restante do código
COPY . /app

# Exponha a porta do Flask
EXPOSE 5000

# Comando para rodar o aplicativo
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]