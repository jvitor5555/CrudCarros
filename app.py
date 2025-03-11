import sqlite3  # Ajuste conforme o banco que estiver usando
from flask import Flask, request, jsonify
from flask import Flask, render_template, request, jsonify
import mysql.connector as sql
import os
import logging
from flask_cors import CORS
from flask_cors import cross_origin

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

CORS(app)

def ConectarBancoDados():
    conn = sql.connect(
        host="localhost",
        user="usuarioPY",
        password="123456789",
        database="Carros"
    )
    return conn
    
def CriarTabela():
    conn = ConectarBancoDados()
    cursor = conn.cursor()
    Criar_Tabela = """
    
        CREATE TABLE IF NOT EXISTS Carros(
            
            Cod_Carros INT AUTO_INCREMENT PRIMARY KEY,
            Nome_Carro VARCHAR(255) NOT NULL,
            Marca_Carro VARCHAR(255) NOT NULL,
            Modelo_Carro VARCHAR(255) NOT NULL,
            Ano_Carro INT NOT NULL,
            Preco_Carro DECIMAL(10,2) NOT NULL,
            Imagem_Carro VARCHAR(255) NOT NULL
        );
    """
    cursor.execute(Criar_Tabela)
    conn.commit() # Salvar as mudanças
    cursor.close()
    conn.close()
 

@app.before_request
def Inicializar():
    if not hasattr(app, "Tabela-Criada"):
        CriarTabela()
        app.tbl = True
        print("A Tabela foi Criada com Sucesso")
        
    else:
        print("Está tudo certo")
        
    
@app.route("/carros", methods=["GET"])
def ListarCarros():
    conn = ConectarBancoDados()
    # O cursor é um obj que permite a interação com o banco de dados
    # (dictionary=True) transforma as colunas do bd em chaves e as linhas em respostas
    cursor = conn.cursor(dictionary=True)  
    cursor.execute("SELECT * FROM Carros")
    # O método fetchall armazena todos os carros na variavel carros
    carros = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(carros)


@app.route("/carros/pesquisa", methods=["POST"])
def ListarCarrosParametros():
    
    conn = ConectarBancoDados()
    cursor = conn.cursor()

    dados = request.get_json()
    
    print("Dados recebidos:", dados)

    nome_carro = dados.get("nome")
    marca_carro = dados.get("marca")
    modelo_carro = dados.get("modelo")
    
    ano_carro = dados.get("ano")
    preco_carro = dados.get("preco")

    query = "SELECT * FROM Carros WHERE 1=1"
    parametros = []

    if nome_carro:
        query += " AND Nome_Carro LIKE %s"
        parametros.append(f"%{nome_carro}%")

    if marca_carro:
        query += " AND Marca_Carro LIKE %s"
        parametros.append(f"%{marca_carro}%")

    if modelo_carro:
        query += " AND Modelo_Carro LIKE %s"
        parametros.append(f"%{modelo_carro}%")

    if ano_carro and ano_carro.isdigit():
        ano_carro = int(ano_carro)
        query += " AND Ano_Carro = %s"
        parametros.append(ano_carro)

    if preco_carro and preco_carro.replace('.', '', 1).isdigit():
        preco_carro = float(preco_carro)
        query += " AND Preco_Carro = %s"
        parametros.append(preco_carro)

    cursor.execute(query, tuple(parametros))
    resultado = cursor.fetchall()
    

    # Melhorando a formatação do retorno
    colunas = [desc[0] for desc in cursor.description]
    resultado_formatado = [dict(zip(colunas, linha)) for linha in resultado]
    
    print(resultado_formatado)

    return jsonify(resultado_formatado), 200


def main ():
    if __name__ == "__main__":
        app.run(debug=True)
        


def InserirCarrosNoBanco(nome, marca, modelo, ano, preco, imagem):
    
    conn = ConectarBancoDados()
    cursor = conn.cursor()
    
    querry = """
    INSERT INTO Carros (Nome_Carro, Marca_Carro, Modelo_Carro, Ano_Carro, Preco_Carro, Imagem_Carro)
    
    VALUES(%s, %s, %s, %s, %s, %s)
    """
    
    valores = (nome, marca, modelo, ano, preco, imagem)
    
    cursor.execute(querry, valores)
    conn.commit()
    
    cursor.close()
    conn.close()
    

PASTA_IMGS = "imgs/"
app.config["PASTA_IMGS"] = PASTA_IMGS

@app.route("/carros/adicionar-carros", methods=["POST"])
def AdicionarCarros():
    
    logging.debug(f"Form Data: {request.form}")
    logging.debug(f"Arquivos recebidos: {request.files}")
    
    nome_carro = request.form.get("nome")
    marca_carro = request.form.get("marca")
    modelo_carro = request.form.get("modelo")
    ano = request.form.get("ano", 0)
    preco = request.form.get("preco", 0.0)
    imagem = request.files.get("imagem")
    
    if imagem:
        imagem_path = os.path.join(app.config["PASTA_IMGS"], imagem.filename)
        imagem.save(imagem_path)
        logging.debug(f"Imagem salva em: {imagem_path}")
    
    if not os.path.exists(app.config["PASTA_IMGS"]):
        os.makedirs(app.config["PASTA_IMGS"])

    try:
        
        if not all([nome_carro, marca_carro, modelo_carro, ano, preco]):
            
            return jsonify({"Erro": "Campos obrigatórios ausentes"}), 400
        
        InserirCarrosNoBanco(nome_carro, marca_carro, modelo_carro, ano, preco, imagem_path)
        
        return jsonify({"Mensagem": "Carro adicionado com Sucesso"}), 201
    
    except Exception as e:
    
        return jsonify({"Erro": str(e)}), 500
    

def PesquisarNoBanco(querry, dado):
    
    conn = ConectarBancoDados()
    cursor = conn.cursor()
    
    valor = (dado,)
    
    cursor.execute(querry, valor)
    resultado = cursor.fetchall()

    cursor.close()
    conn.close()
    
    return resultado
    

@app.route("/carros/buscar-carros", methods=["POST"])
def BuscarCarro():
    
    
    try:
    
        dados = request.json
        
        nome_carro = dados.get("nome")
        marca_carro = dados.get("marca")
        modelo_carro = dados.get("modelo")
        ano = dados.get("ano") 
        preco = dados.get("preco") 
        
        print("Antes do laço", ano, preco)
        
        
        if ano is not None and preco is not None:
            
         ano = int(ano) if ano != "" else 0
         preco = float(preco) if preco != "" else 0.0
         print("Dentro do laço", ano, preco)
        print("Depois do laço", ano, preco)

            
    except ValueError as e:
        
        return jsonify({"Mensagem": f"Informe dados válidos, {e}"}), 404
    
    
    if any(value not in [None, "", 0, 0.0] for value in [nome_carro, marca_carro, modelo_carro, ano, preco]):
        
    
        if nome_carro:
            
            Querry_Nome_carro = """SELECT * FROM Carros WHERE Nome_Carro  = %s"""
            resultado = PesquisarNoBanco(Querry_Nome_carro, nome_carro)
            return jsonify({"Resultado": resultado}), 200
        
        elif marca_carro:
            
            Querry_Marca_carro = """SELECT * FROM Carros WHERE Marca_Carro = %s"""
            resultado = PesquisarNoBanco(Querry_Marca_carro, marca_carro)
            return jsonify({"Resultado": resultado}), 200
            
        elif modelo_carro:
            
            Querry_Modelo_Carro = """SELECT * FROM Carros WHERE Modelo_Carro = %s"""
            resultado = PesquisarNoBanco(Querry_Modelo_Carro, modelo_carro)
            return jsonify({"Resultado": resultado}), 200
        
        elif ano:
            
            Querry_Ano_Carro = """SELECT * FROM Carros WHERE Ano_Carro = %s"""
            resultado = PesquisarNoBanco(Querry_Ano_Carro, ano)
            return jsonify({"Resultado": resultado}), 200
        
        elif preco:

            Querry_Preco_Carro = """SELECT * FROM Carros WHERE Preco_Carro = %s"""
            resultado = PesquisarNoBanco(Querry_Preco_Carro, preco)
            return jsonify({"Resultado": resultado}), 200
        
        else:
            return jsonify({"Erro": "Um dado precisa ser válido"}), 500
    
    else :
        
        return jsonify({"Erro": "Espera-se um dado válido"}), 500
        

@app.route("/carros/atualizar", methods=["PUT"])
def AtualizarCarrosNoBanco():
    conn = ConectarBancoDados()
    cursor = conn.cursor()

    dados = request.json

    id_carro = dados.get("id")
    nome_carro = dados.get("nome")
    marca_carro = dados.get("marca")
    modelo_carro = dados.get("modelo")
    ano = dados.get("ano")
    preco = dados.get("preco")
    imagem = dados.get("imagem")

    valores = []

    if id_carro is not None and id_carro != "":
        id_carro = int(id_carro)
    else:
        return jsonify({"Erro": "Informe um ID Válido"}), 404

    querry = "SELECT * FROM Carros WHERE Cod_Carros = %s"
    resultado = PesquisarNoBanco(querry, id_carro)

    if not resultado:
        return jsonify({"Erro": "Carro não encontrado"}), 404

    colunas = ["Cod_Carros", "Nome_Carro", "Marca_Carro",
               "Modelo_Carro", "Ano_Carro", "Preco_Carro", "Imagem_Carro"]

    carros_dict = dict(zip(colunas, resultado[0]))

    nome_antigo = carros_dict.get("Nome_Carro")
    marca_antiga = carros_dict.get("Marca_Carro")
    modelo_antigo = carros_dict.get("Modelo_Carro")
    ano_antigo = int(carros_dict.get("Ano_Carro"))
    preco_antigo = int(carros_dict.get("Preco_Carro"))
    imagem_antiga = carros_dict.get("Imagem_Carro")
    
    nome_carro = nome_carro if nome_carro else nome_antigo
    marca_carro = marca_carro if marca_carro else marca_antiga
    modelo_carro = modelo_carro if modelo_carro else modelo_antigo
    ano = int(ano) if ano is not None and ano != "" else ano_antigo
    preco = float(preco) if preco is not None and preco != "" else preco_antigo
    imagem = imagem if imagem else imagem_antiga

    valores.extend([nome_carro, marca_carro, modelo_carro,
                   ano, preco, imagem, id_carro])

    query_update = """
    UPDATE Carros
    SET Nome_Carro = %s, Marca_Carro = %s, Modelo_Carro = %s, Ano_Carro = %s, Preco_Carro = %s, Imagem_Carro = %s
    WHERE Cod_Carros = %s;
    """

    try:
        cursor.execute(query_update, tuple(valores))
        conn.commit()
        return jsonify({"Mensagem": "Carro atualizado com sucesso"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"Erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



@app.route("/carros/deletar", methods=["DELETE"])
def ApagarCarrosDoBanco():
    
    conn = ConectarBancoDados()
    cursor = conn.cursor()
    
    dados = request.json
    
    id_carro = dados.get("id")
    
    if id_carro is not None and id_carro != "":
        
        Querry = """
        DELETE FROM Carros WHERE Cod_Carros = %s;
        """
        try:
            cursor.execute(Querry, (id_carro,))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({"Erro": "Carro não encontrado"}), 404
            
            
            return jsonify({"Mensagem": "Carro Removido com sucesso"}), 201
        except Exception as e:
            conn.rollback()
            return jsonify({"Erro": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
        
    else:
        return jsonify({"Erro": "Informe Valores Válidos"}), 404
    
main()