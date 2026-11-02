# Roteiro de Testes - Bão de Roda

Testes manuais de ponta a ponta. Marque a coluna **Resultado** com ✅ (passou) ou ❌ (falhou).

**Ambiente:** back-end em `http://localhost:8080`, front-end em `http://localhost:5173`, banco no Supabase.
**Usuários de teste:** agentes `locadora` / `locadora123` (empresa) e `banco` / `banco123` (banco); clientes criados pelo cadastro.

## 0. Preparação

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 0.1 | Subir o back-end (`.\mvnw.cmd spring-boot:run`) | Log com `Started AluguelCarrosApplication`; Spring Boot 4.0.8 | |
| 0.2 | Conferir a versão do Java (`java -version`) | JDK 25 | |
| 0.3 | Conferir as tabelas no Supabase (Table Editor) | Existem `usuarios`, `clientes`, `rendimentos`, `automoveis`, `pedidos_aluguel`, `avaliacoes`, `contratos_aluguel` e `contratos_credito` | |

## 1. Login obrigatório

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 1.1 | Sem login, abrir `/pedidos` | Redireciona para o login | |
| 1.2 | Entrar com senha errada | Mensagem "Usuário ou senha inválidos." | |
| 1.3 | Entrar como `locadora` | Abre a tela inicial do agente | |
| 1.4 | Clicar em **Sair** e usar o botão voltar do navegador | Não entra novamente sem login | |
| 1.5 | Como cliente, abrir `/automoveis` | Volta para o início | |
| 1.6 | Como agente, abrir `/perfil` | Volta para o início | |

## 2. Cadastro e CRUD de cliente

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 2.1 | Cadastrar cliente com 3 rendimentos | O botão "Adicionar rendimento" fica desabilitado no 3º; cadastro concluído | |
| 2.2 | Cadastrar outro cliente com o mesmo usuário | "Este usuário já está em uso." | |
| 2.3 | Cadastrar outro cliente com o mesmo CPF | "CPF já cadastrado." | |
| 2.4 | Cadastrar com senha de menos de 6 caracteres | Cadastro bloqueado | |
| 2.5 | Abrir **Meu cadastro** | Dados carregados; usuário e CPF desabilitados | |
| 2.6 | Alterar nome, endereço e rendimentos; salvar; recarregar a página | Alterações persistem (conferir também no Supabase) | |
| 2.7 | Trocar a senha, sair e entrar com a nova | Login com a nova senha funciona | |
| 2.8 | No Supabase, ver a coluna `senha` de `usuarios` | Valor criptografado (começa com `$2`) | |
| 2.9 | Excluir um cliente sem pedidos | Cadastro removido; não consegue mais entrar | |
| 2.10 | Tentar excluir um cliente com pedidos | Bloqueado, com mensagem explicativa | |

## 3. Pedidos do cliente

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 3.1 | Em **Novo pedido**, tentar datas passadas ou devolução antes da retirada | Bloqueado | |
| 3.2 | Escolher carro e datas válidas; enviar | Pedido criado com status "Em análise"; resumo mostra as diárias | |
| 3.3 | Modificar o pedido (carro ou datas) | Alterações salvas | |
| 3.4 | Cancelar um pedido | Status "Cancelado"; botões de modificar e cancelar somem | |
| 3.5 | Usar os filtros por status em **Meus pedidos** | Contagens e listas corretas | |
| 3.6 | Com outro cliente, abrir a URL de um pedido alheio | Pedido não é exibido | |

## 4. Análise e contrato (agente)

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 4.1 | Como `locadora`, abrir **Pedidos** | Lista com os pedidos de todos os clientes, com o nome de cada um | |
| 4.2 | Modificar um pedido em análise | Alterações salvas | |
| 4.3 | Reprovar um pedido com justificativa | Cliente vê "Reprovado" e o motivo; o pedido não pode ser avaliado de novo | |
| 4.4 | Aprovar outro pedido | Status "Aprovado" | |
| 4.5 | Em pedido aprovado, como `locadora`, ver as opções de contrato | "Propriedade do cliente" e "Propriedade da empresa" | |
| 4.6 | Executar o contrato com "Propriedade da empresa" | Status "Contrato executado"; proprietário do carro = locadora | |
| 4.7 | Em outro pedido aprovado, executar com "Propriedade do cliente" | Proprietário do carro = cliente (conferir `proprietario_id` no Supabase) | |
| 4.8 | Como `banco`, ver as opções de contrato | "Propriedade do cliente" e "Propriedade do banco" | |
| 4.9 | Como cliente, tentar cancelar pedido com contrato executado | Não há botão de cancelar | |

## 5. Contrato de crédito

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 5.1 | Como `banco`, abrir pedido com contrato executado | Painel "Conceder crédito" visível | |
| 5.2 | Preencher valor, juros e prazo; registrar | Crédito aparece no detalhe do pedido | |
| 5.3 | Como `locadora`, abrir o mesmo pedido | Painel de crédito não aparece | |
| 5.4 | Reabrir o pedido como `banco` | Painel de crédito não volta (um crédito por aluguel) | |
| 5.5 | Como cliente, abrir o pedido | Vê o contrato, o proprietário do carro e o crédito | |

## 6. Automóveis (agente)

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 6.1 | Cadastrar um carro sem foto | Aparece com a ilustração | |
| 6.2 | Editar o carro e colar um link de imagem | Prévia aparece; após salvar, a foto aparece nas telas de pedidos | |
| 6.3 | Cadastrar uma placa repetida | "Placa já cadastrada." | |
| 6.4 | Colar um link inválido | A ilustração continua aparecendo | |

## 7. Permissões na API

```powershell
# Sem login: esperado 401
try { Invoke-RestMethod http://localhost:8080/pedidos } catch { $_.Exception.Response.StatusCode.value__ }

# Cliente tentando cadastrar carro: esperado 403
$t = (Invoke-RestMethod -Method Post http://localhost:8080/auth/login -ContentType 'application/json' -Body '{"login":"CLIENTE","senha":"SENHA"}').token
try { Invoke-RestMethod -Method Post http://localhost:8080/automoveis -Headers @{Authorization="Bearer $t"} -ContentType 'application/json' -Body '{"matricula":"X","ano":2020,"marca":"A","modelo":"B","placa":"ZZZ9Z99"}' } catch { $_.Exception.Response.StatusCode.value__ }
```

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 7.1 | Listar pedidos sem token | HTTP 401 | |
| 7.2 | Cliente cadastrando automóvel | HTTP 403 | |

## 8. Geral

| # | Passo | Resultado esperado | Resultado |
| :-: | :--- | :--- | :-: |
| 8.1 | Recarregar a página logado | A sessão continua | |
| 8.2 | Abrir o modo responsivo (F12) em tamanho de celular | Nenhuma tela quebra | |
| 8.3 | `npm run lint` e `npm run build` no front-end | Sem erros | |
