fetch('https://api.exemplo.com/dados')
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => console.log(data))   // Exibe os dados no console
    .catch(error => console.error('Erro:', error)); // Captura erros
