let nome_carro = document.getElementById("nome");
let marca_carro = document.getElementById("marca");
let modelo_carro = document.getElementById("modelo");
let ano_carro = document.getElementById("ano");
let preco_carro = document.getElementById("preco");

function NomeArquivo() {
    var arquivo = document.getElementById("imagem").files[0];

    if (arquivo) {
        document.getElementById("file-name").textContent = arquivo.name;
    } else {
        document.getElementById("file-name").textContent = "Nenhum arquivo selecionado";
    }
}

document.getElementById("imagem").addEventListener("change", NomeArquivo);

document.getElementById("botao-cadastrar").addEventListener("click", function (event) {
    
    event.preventDefault();

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
        window.alert("Por favor, selecione uma imagem.");
        return; 
    } 

    for (let [key, value] of formdata.entries()) {
        console.log(key, value); // Exibe todos os dados anexados ao FormData
    }

    fetch("https://crudcarros-production.up.railway.app/carros/adicionar-carros", {
        
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
            window.alert("Carro cadastrado com sucesso!"); 
            console.log("Resposta do servidor:", data); 
        })
        .catch(error => {
            window.alert(`Erro ao cadastrar o carro: ${error.message || "Erro desconhecido"}`); // Mensagem de erro
            console.error("Erro na requisição:", error); // Exibe o erro no console
        });
    
});

