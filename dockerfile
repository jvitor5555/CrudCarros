# Use uma imagem base do Python
FROM python:3.12.9-slim

# Instale o git e outras dependências necessárias
RUN apt-get update && apt-get install -y git build-essential python3-dev

# Copie o arquivo requirements.txt para o contêiner
COPY requirements.txt /app/requirements.txt

# Instale as dependências do Python
RUN pip install --no-cache-dir -r /app/requirements.txt

# Defina variáveis de ambiente (usando o formato correto)
ENV PYTHONUNBUFFERED=1

# Copie o restante do código
COPY . /app

# Defina o diretório de trabalho
WORKDIR /app

# Comando padrão para executar o aplicativo
CMD ["python", "seu_script.py"]