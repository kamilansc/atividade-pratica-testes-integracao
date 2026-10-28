# Repositório de testes de integração

Repositório acadêmico referente a um exercício prático sobre testes de integração, abordado na disciplina de Engenharia de Software III do curso de Análise e Desenvolvimento de Sistemas (ADS).

O repositório reúne dois exercícios: um sistema de controle de estoque testado com Python e `pytest`, e um painel de medicação implementado em TypeScript e testado com Vitest.

## Objetivos

- Adquirir noções práticas de como planejar e executar testes de integração.
- Aprender a executar testes independentemente da linguagem. Para isso, o exercício utiliza dois projetos com linguagens e tecnologias distintas.
- Verificar a comunicação entre componentes reais e confirmar os efeitos das operações diretamente no banco de dados.

O roteiro da atividade está em [`RoteirodoTrabalhoPratico-TestedeIntegracao.pdf`](RoteirodoTrabalhoPratico-TestedeIntegracao.pdf). Ele apresenta o exercício de estoque e propõe um trabalho complementar de integração em outro projeto.

## Exercício 1: Sistema de Estoque (Python)

O `EstoqueService` aplica as regras de venda e reposição e usa o `ProdutoRepository` para consultar e atualizar produtos no SQLite. A fixture `conexao` cria um banco `:memory:` novo, aplica o schema, insere um produto com 10 unidades e fecha a conexão ao final de cada teste.

Abordagens cobertas pelos testes:

- Verificar se uma venda desconta corretamente a quantidade do produto no banco.
- Verificar se a reposição aumenta corretamente a quantidade em estoque.
- Verificar se ocorre uma exceção ao tentar vender com estoque insuficiente.
- Usar `pytest.mark.parametrize` para testar diferentes valores e verificar se ocorre a exceção esperada.

## Exercício 2: Sistema de Medicação (TypeScript)

O painel usa Express, `better-sqlite3` e Vitest. O `medicationsService` valida os dados de uma prescrição e realiza operações no SQLite. Os testes exercitam o serviço real e verificam tanto a persistência quanto as exceções de validação.

### Banco de dados isolado nos testes

O módulo de produção `src/database.ts` cria uma conexão com um arquivo SQLite. Para que os testes não usem nem alterem esse arquivo, a fixture cria um banco `:memory:` novo para cada teste. O `vi.mock` substitui o módulo de conexão por um getter que retorna esse banco. Assim, quando o serviço acessa `db`, ele recebe a conexão de teste; ao final, `afterEach` fecha o banco.

Abordagens cobertas pelos testes:

- Criar uma prescrição válida e consultar diretamente a tabela para confirmar os valores persistidos.
- Usar `test.each` para verificar que campos obrigatórios ausentes ou com tipo inválido, e `notes` com tipo inválido, lançam `ValidationError`.

## Estrutura do repositório

```text
.
├── README.md
├── RoteirodoTrabalhoPratico-TestedeIntegracao.pdf
├── Sistema de Estoque/
│   ├── schema.sql
│   ├── src/
│   │   ├── estoque_service.py
│   │   ├── produto.py
│   │   └── produto_repository.py
│   └── test_estoque_service_integration.py
└── Sistema de medicacao/
    ├── database/             # schema e dados iniciais
    ├── public/               # interface web
    ├── src/                  # API Express e serviço
    ├── test/                 # testes de integração e fixture
    ├── package.json
    └── README.md              # instruções originais do painel
```

## Como executar

### Sistema de Estoque: instalar e executar os testes

Requer Python 3.10 ou superior e `pytest`. No PowerShell:

```powershell
cd "Sistema de Estoque"
py -m pip install pytest
$env:PYTHONPATH = "$PWD\src"
pytest -v
```

Execute os comandos a partir da pasta `Sistema de Estoque`, pois a fixture carrega `schema.sql` usando o diretório atual.

### Sistema de Medicação: executar os testes

Requer Node.js 22 ou superior. No PowerShell:

```powershell
cd "Sistema de medicacao"
npm install
npm test
npm run check
```

`npm test` executa a suíte Vitest. `npm run check` executa `tsc --noEmit`, que verifica os tipos sem gerar arquivos JavaScript. A configuração do TypeScript inclui a pasta `test`, então a checagem também abrange os arquivos de teste.

### Sistema de Medicação: executar a aplicação

Na pasta `Sistema de medicacao`:

```powershell
npm run db:reset
npm run dev
```

A aplicação fica disponível em <http://localhost:3000>. O comando `npm run db:reset` recria o banco em disco da aplicação e insere dados fictícios. Os testes continuam usando seus próprios bancos em memória.

## Aprendizados

Durante o desenvolvimento dos testes, foi possível detectar falhas na implementação do código-fonte e levantar ideias de como solucioná-las. Isso evidencia a eficácia dos testes como apoio para encontrar problemas e orientar melhorias.

## Integrantes

- Kamila Rocha
- Mylena Duarte
