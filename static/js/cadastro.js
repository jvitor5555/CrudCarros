document.getElementById("imagem").addEventListener("change", NomeArquivo);

function NomeArquivo() {
    var arquivo = document.getElementById("imagem").files[0];

    if (arquivo) {
        document.getElementById("file-name").textContent = arquivo.name;
    } else {
        document.getElementById("file-name").textContent = "Nenhum arquivo selecionado";
    }
}

// Obtendo os elementos do formulário
let nome_carro = document.getElementById("nome");
let marca_carro = document.getElementById("marca");
let modelo_carro = document.getElementById("modelo");
let ano_carro = document.getElementById("ano");
let preco_carro = document.getElementById("preco");

function CadastrarCarros() {
    let imagem_carro = document.getElementById("imagem").files[0];
    let formdata = new FormData();

    formdata.append("nome", nome_carro.value);
    formdata.append("marca", marca_carro.value);
    formdata.append("modelo", modelo_carro.value);
    formdata.append("ano", ano_carro.value);
    formdata.append("preco", preco_carro.value);
    formdata.append("imagem", imagem_carro);

    if (!imagem_carro) {
        console.log("Nenhuma imagem selecionada.");
    } else {
        console.log("Imagem selecionada:", imagem_carro);
    }

    for (let [key, value] of formdata.entries()) {
        console.log(key, value); // Exibe todos os dados anexados ao FormData
    }

    fetch("http://localhost:5000/carros/adicionar-carros", {
        method: "POST",
        body: formdata
    })
        .then(response => {
            if (response.status >= 400 && response.status <= 599) {
                return response.json().then(errorData => {
                    throw { status: response.status, message: errorData.message || "Erro no servidor" };
                });
            }
            return response.json(); // Se for bem-sucedido, converte para JSON
        })
        .then(data => {
            const respostadiv = document.getElementById("resposta");
            if (respostadiv) {
                respostadiv.innerHTML = `<div class="sucesso">Resposta do Servidor: ${JSON.stringify(data)}</div>`;
                setTimeout(() => {
                    respostadiv.innerHTML = "";
                }, 10000);
            } else {
                console.error("Elemento resposta não encontrado.");
            }
        })
        .catch(error => {
            const respostadiv = document.getElementById("resposta");
            if (respostadiv) {
                respostadiv.innerHTML = `<div class="erro">ERRO (${error.status || "Desconhecido"}): ${error.message || "Erro ao processar a requisição"}</div>`;
                setTimeout(() => {
                    respostadiv.innerHTML = "";
                }, 10000);
            } else {
                console.error("Elemento resposta não encontrado.");
            }
        });
}

