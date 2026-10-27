import pytest
import sqlite3
from produto_repository import ProdutoRepository
from estoque_service import EstoqueService, EstoqueInsuficienteError

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



def test_adicionar_estoque_atualiza_banco(conexao):
    # Arrange: preparar os componentes
    repositorio = ProdutoRepository(conexao)
    service = EstoqueService(repositorio)

    # Act: adicionar 5 unidades ao produto 1
    service.adicionar_estoque(1, 5)

    # Assert: verificar o resultado
    resultado = conexao.execute(
        "SELECT quantidade FROM produto WHERE id = ?", (1,)
    ).fetchone()

    assert resultado[0] == 15



def test_vender_produto_com_estoque_insuficiente_nao_altera_banco(conexao):
    # Arrange: preparar os componentes
    repositorio = ProdutoRepository(conexao)
    service = EstoqueService(repositorio)

    # Act e Assert: tentar vender mais unidades do que existem
    with pytest.raises(EstoqueInsuficienteError):
        service.vender_produto(1, 15)

    # Verificar o resultado
    resultado = conexao.execute(
        "SELECT quantidade FROM produto WHERE id = ?", (1,)
    ).fetchone()

    assert resultado[0] == 10


@pytest.mark.parametrize(
    "qtd_vendida, erro_esperado", 
    [
        (0, ValueError), 
        (-2, ValueError), 
        (12, EstoqueInsuficienteError)
    ]
)
def test_vender_produto_com_quantidade_invalida(conexao, qtd_vendida, erro_esperado):
    # Arrange
    repositorio = ProdutoRepository(conexao)
    service = EstoqueService(repositorio)

    # Act e Assert
    with pytest.raises(erro_esperado):
        service.vender_produto(1, qtd_vendida)