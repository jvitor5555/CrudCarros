function ListarCarros() {
    // Captura os valores dos campos do formulário
    let nome_carro = document.getElementById("nome").value;
    let marca_carro = document.getElementById("marca").value;
    let modelo_carro = document.getElementById("modelo").value;
    let ano_carro = document.getElementById("ano").value;
    let preco_carro = document.getElementById("preco").value;

    // Cria um objeto com os dados do carro
    let dados = {
        "nome": nome_carro,
        "marca": marca_carro,
        "modelo": modelo_carro,
        "ano": ano_carro,
        "preco": preco_carro
    };

    // Faz a requisição POST para a API
    fetch("https://crudcarros-production.up.railway.app/carros/pesquisa", {
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
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            console.log("Resposta da API:", data); // Exibe a resposta completa no console

            let novalista = [];

            // Verifica se a resposta é um array de objetos
            if (Array.isArray(data)) {
                // Itera sobre cada objeto no array
                data.forEach(carro => {
                    let valores = Object.values(carro); // Extrai os valores de cada objeto
                    novalista.push(valores);
                });
            } else if (typeof data === 'object' && data !== null) {
                // Se a resposta for um único objeto
                let valores = Object.values(data);
                novalista.push(valores);
            } else {
                console.error("Formato de resposta inesperado:", data);
            }

            // Limpa a div de resposta antes de adicionar novos elementos
            let divResposta = document.getElementById("resposta");
            let divImagens = document.getElementById("nova-resposta");
            divResposta.innerHTML = "";
            divImagens.innerHTML = "";

            // Itera sobre cada carro na novalista
            for (let cont = 0; cont < novalista.length; cont++) {
                let elemento = novalista[cont];

                // Extrai os valores do carro (ajuste os índices conforme a ordem dos campos no banco)
                let ano = elemento[0];
                //let cod = elemento[1]; // Código do banco de dados
                let imagem = elemento[2];
                let marca = elemento[3];
                let modelo = elemento[4];
                let nome = elemento[5];
                let preco = elemento[6];

                let lugar_imagem = document.getElementById("nova-resposta")
                let x = document.getElementById("resposta")

                // Adiciona a imagem (se existir)
                if (imagem && imagem.includes("imgs")) {
                    let img = document.createElement("img");
                    img.src = `/${imagem}`; 
                    img.alt = "Imagem do Carro";
                    img.classList.add("imagem-carro");
                    lugar_imagem.appendChild(img);
                }

                let p_nome = document.createElement("div");
                p_nome.textContent = nome;
                p_nome.classList.add("item")
                x.appendChild(p_nome);

                let p_marca = document.createElement("div");
                p_marca.textContent = marca;
                p_marca.classList.add("item")
                x.appendChild(p_marca);

                let p_modelo = document.createElement("div");
                p_modelo.textContent = modelo;
                p_modelo.classList.add("item")
                x.appendChild(p_modelo);

                let p_ano = document.createElement("div");
                p_ano.textContent = ano;
                p_ano.classList.add("item")
                x.appendChild(p_ano);

                let p_preco = document.createElement("div");
                p_preco.textContent = `R$ ${preco}`;
                p_preco.classList.add("item")
                x.appendChild(p_preco);

            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error); // Exibe erros no console
        });
}


function ListarTudo() {
    
    fetch('http://localhost:5000/carros')
        .then(response => {

            if (!response.ok) {
                throw new Error(`Erro HTTP! Status ${response.status}`);
            }
            return response.json(); // Converte a resposta para JSON
        }) 
        .then(data => {

            console.log("Resposta da API:", data); // Exibe a resposta completa no console

            let novalista = [];

            // Verifica se a resposta é um array de objetos
            if (Array.isArray(data)) {
                // Itera sobre cada objeto no array
                data.forEach(carro => {
                    let valores = Object.values(carro); // Extrai os valores de cada objeto
                    novalista.push(valores);
                });
            } else if (typeof data === 'object' && data !== null) {
                // Se a resposta for um único objeto
                let valores = Object.values(data);
                novalista.push(valores);
            } else {
                console.error("Formato de resposta inesperado:", data);
            }

            // Limpa a div de resposta antes de adicionar novos elementos
            let divResposta = document.getElementById("resposta");
            let divImagens = document.getElementById("nova-resposta");
            divResposta.innerHTML = "";
            divImagens.innerHTML = "";

            // Itera sobre cada carro na novalista
            for (let cont = 0; cont < novalista.length; cont++) {
                let elemento = novalista[cont];

                // Extrai os valores do carro (ajuste os índices conforme a ordem dos campos no banco)
                let ano = elemento[0];
                //let cod = elemento[1]; // Código do banco de dados
                let imagem = elemento[2];
                let marca = elemento[3];
                let modelo = elemento[4];
                let nome = elemento[5];
                let preco = elemento[6];

                let lugar_imagem = document.getElementById("nova-resposta")
                let x = document.getElementById("resposta")

                

                // Adiciona a imagem (se existir)
                if (imagem && imagem.includes("imgs")) {

                    let img = document.createElement("img");
                    img.src = `/${imagem}`;
                    img.alt = "Imagem do Carro";
                    img.classList.add("imagem-carro");
                    lugar_imagem.appendChild(img);
                }

                let p_nome = document.createElement("div");
                p_nome.textContent = nome;
                p_nome.classList.add("item")
                x.appendChild(p_nome);

                let p_marca = document.createElement("div");
                p_marca.textContent = marca;
                p_marca.classList.add("item")
                x.appendChild(p_marca);

                let p_modelo = document.createElement("div");
                p_modelo.textContent = modelo;
                p_modelo.classList.add("item")
                x.appendChild(p_modelo);

                let p_ano = document.createElement("div");
                p_ano.textContent = ano;
                p_ano.classList.add("item")
                x.appendChild(p_ano);

                let p_preco = document.createElement("div");
                p_preco.textContent = `R$ ${preco}`;
                p_preco.classList.add("item")
                x.appendChild(p_preco);

            }
        })   
        .catch(error => console.error('Erro:', error)); 

}

function Limpar() {
    
    document.getElementById("nome").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("preco").value = "";
}