function ListarCarros() {
    let nome_carro = document.getElementById("nome").value;
    let marca_carro = document.getElementById("marca").value;
    let modelo_carro = document.getElementById("modelo").value;
    let ano_carro = document.getElementById("ano").value;
    let preco_carro = document.getElementById("preco").value;

    let dados = {
        "nome": nome_carro,
        "marca": marca_carro,
        "modelo": modelo_carro,
        "ano": ano_carro,
        "preco": preco_carro
    };

    fetch("http://localhost:5000/carros/pesquisa", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status ${response.status}`);
            }
            return response.json(); // Converte para objeto JS
        })
        .then(data => ({}))
        .catch(error => console.error("Erro: ", error));
}
