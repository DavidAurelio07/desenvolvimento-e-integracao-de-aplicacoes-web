# Histórias de Usuário - Bão de Roda

**Atores:** Cliente, Agente (Empresa ou Banco).

**Status possíveis de um pedido:** Em análise, Aprovado, Reprovado, Contrato executado, Cancelado.

---

## HU01 - Cadastrar cliente

**Como** cliente, **quero** me cadastrar no sistema **para** poder solicitar aluguéis de automóveis.

**Critérios de aceite**

- O cadastro exige RG, CPF, nome, endereço e profissão.
- É possível informar até 3 entidades empregadoras, cada uma com o respectivo rendimento.
- Não é permitido cadastrar dois clientes com o mesmo CPF.
- O cadastro exige usuário e senha.

**Caso de uso:** UC01 | **Sprint sugerida:** 2

## HU02 - Autenticar no sistema

**Como** usuário (cliente ou agente), **quero** fazer login com usuário e senha **para** acessar o sistema.

**Critérios de aceite**

- Somente usuários cadastrados conseguem acessar as funcionalidades.
- Credenciais inválidas exibem mensagem de erro e não concedem acesso.
- Rotas protegidas redirecionam usuários não autenticados para o login.

**Caso de uso:** UC02 | **Sprint sugerida:** 2

## HU03 - Consultar, alterar e excluir meu cadastro

**Como** cliente, **quero** consultar, alterar e excluir meus dados **para** mantê-los atualizados.

**Critérios de aceite**

- O cliente visualiza todos os seus dados cadastrais.
- A alteração respeita as mesmas validações do cadastro (incluindo o limite de 3 rendimentos).
- A exclusão pede confirmação.

**Caso de uso:** UC01 | **Sprint sugerida:** 2

## HU04 - Introduzir pedido de aluguel

**Como** cliente, **quero** criar um pedido de aluguel de automóvel **para** iniciar o processo de contratação.

**Critérios de aceite**

- O pedido é associado ao cliente autenticado e a um automóvel.
- Ao ser criado, o pedido recebe o status "Em análise".

**Caso de uso:** UC03 | **Sprint sugerida:** 3

## HU05 - Consultar pedidos e status

**Como** cliente, **quero** consultar meus pedidos e o status de cada um **para** acompanhar o andamento.

**Critérios de aceite**

- O cliente vê somente os próprios pedidos.
- Cada pedido mostra seu status atual.

**Caso de uso:** UC05 | **Sprint sugerida:** 3

## HU06 - Modificar pedido (cliente)

**Como** cliente, **quero** modificar um pedido **para** corrigir ou ajustar informações.

**Critérios de aceite**

- Só é possível modificar pedidos que ainda não tiveram o contrato executado nem foram cancelados.

**Caso de uso:** UC04 | **Sprint sugerida:** 3

## HU07 - Cancelar pedido

**Como** cliente, **quero** cancelar um pedido **para** desistir do aluguel.

**Critérios de aceite**

- O cancelamento pede confirmação.
- O status do pedido passa a "Cancelado".
- Pedidos com contrato executado não podem ser cancelados por este fluxo.

**Caso de uso:** UC06 | **Sprint sugerida:** 3

## HU08 - Modificar pedido (agente)

**Como** agente, **quero** modificar pedidos **para** ajustar condições antes da execução do contrato.

**Critérios de aceite**

- O agente consegue editar pedidos que estão em análise.

**Caso de uso:** UC04 | **Sprint sugerida:** 4

## HU09 - Avaliar pedido financeiramente

**Como** agente, **quero** analisar o pedido do ponto de vista financeiro **para** emitir um parecer.

**Critérios de aceite**

- O agente visualiza os dados do cliente, incluindo profissão, empregadores e rendimentos.
- O parecer positivo muda o status para "Aprovado".
- O parecer negativo muda o status para "Reprovado".

**Caso de uso:** UC07 | **Sprint sugerida:** 4

## HU10 - Executar contrato de aluguel

**Como** agente, **quero** executar o contrato de um pedido aprovado **para** formalizar o aluguel.

**Critérios de aceite**

- Só é possível executar contrato de pedidos com parecer positivo.
- O automóvel é registrado como propriedade do cliente, da empresa ou do banco, conforme o tipo de contrato.
- O status passa a "Contrato executado".

**Caso de uso:** UC08 | **Sprint sugerida:** 4

## HU11 - Associar contrato de crédito

**Como** banco agente, **quero** associar um contrato de crédito a um aluguel **para** financiar o automóvel.

**Critérios de aceite**

- O contrato de crédito é opcional.
- Cada contrato de crédito está ligado a um único banco agente.

**Caso de uso:** UC09 | **Sprint sugerida:** 4

## HU12 - Gerenciar automóveis

**Como** agente, **quero** cadastrar e manter automóveis **para** que possam ser alugados.

**Critérios de aceite**

- O automóvel registra matrícula, ano, marca, modelo e placa.
- A placa é única no sistema.

**Caso de uso:** UC10 | **Sprint sugerida:** 3
