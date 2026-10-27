import pytest
import sqlite3
from produto_repository import ProdutoRepository
from estoque_service import EstoqueService

@pytest.fixture #fixture é uma função que prepara algo necessário pra executar um teste
def conexao(): #essa é uma fixture de conexão com o banco de dados
    conn = sqlite3.connect(":memory:") #cria uma conexão com o banco que fica armazenado apenas em memória

    with open("schema.sql", "r", encoding="utf-8") as arquivo:
        conn.executescript(arquivo.read())

    conn.execute("""
        INSERT INTO produto (id, nome, quantidade)
        VALUES (1, 'TECLADO', 10)
    """)

    yield conn

    conn.close()

def test_vender_produto_com_estoque_suficiente(conexao):
    # Arrange: preparar os componentes necessários
    repositorio = ProdutoRepository(conexao)
    service = EstoqueService(repositorio)
    
    # Act: vender 3 unidades do produto 1
    service.vender_produto(1, 3)

    # Assert: Verificar o resultado
    resultado = conexao.execute(
        "SELECT quantidade FROM produto WHERE id = ?", (1,)
    ).fetchone()

    assert resultado[0] == 7