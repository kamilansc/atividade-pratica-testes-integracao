import pytest
import sqlite3

@pytest.fixture #fixture é uma função que prepara algo necessário pra executar um teste
def conexao(): # essa é uma fixture de conexão com o banco de dados
    return sqlite3.connect(":memory:")