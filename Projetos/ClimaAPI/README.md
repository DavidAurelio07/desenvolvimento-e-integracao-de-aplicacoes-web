# 🌦️ API REST de Clima — Belo Horizonte (Spring Boot)

API REST desenvolvida em Java com Spring Boot para consultar e retornar informações meteorológicas atualizadas da cidade de **Belo Horizonte - MG**, consumindo dados da API externa **WeatherAPI**.

Atividade realizada para a disciplina de Desenvolvimento e Integração de Aplicações Web.

---

## 🚀 Tecnologias Utilizadas

- **Java 17+**
- **Spring Boot**
- **RestTemplate** (para consumo de API externa)
- **Maven**
- **WeatherAPI** (servidor meteorológico externo)

---

## 📋 Funcionalidades e Endpoint

A aplicação disponibiliza um endpoint que processa e simplifica a resposta da API externa, retornando um JSON formatado com os principais dados de clima.

### 🌐 Consultar Clima Atual
* **HTTP Method:** `GET`
* **URL:** `http://localhost:8080/clima`

#### 📤 Exemplo de Resposta (JSON):
```json
{
  "cidade": "Belo Horizonte - Minas Gerais",
  "temperaturaAtual": 23.3,
  "umidadeAr": 55,
  "velocidadeVento": 3.6,
  "direcaoVento": 22,
  "condicaoClimatica": "Chuva passageira fraca",
  "temperaturaMaxima": 27.1,
  "temperaturaMinima": 16.1,
  "dataHoraConsulta": "2026-08-24 17:45"
}

```

## 🔑 Configuração da API Key

Para executar o projeto localmente, é necessário ter uma chave de acesso da WeatherAPI.

Cadastre-se gratuitamente em WeatherAPI.

Obtenha sua API Key no painel da conta.

Insira sua chave na variável apiKey dentro do arquivo ClimaService.java (ou configure no application.properties).

### 📂 Estrutura do Projeto

```
src/
└── main/
    └── java/
        └── com/example/ClimaAPI/
            ├── controller/
            │   └── ClimaController.java   # Expoe o endpoint /clima
            ├── dto/
            │   └── ClimaResponseDTO.java  # Estrutura padronizada de resposta
            └── service/
                └── ClimaService.java      # Lógica de consumo da API externa

```
### ▶️ Como Executar o Projeto Localmente
Clone este repositório:

```
git clone [https://github.com/DavidAurelio07/desenvolvimento-e-integracao-de-aplicacoes-web.git]

```
Acesse a pasta do projeto:

```
cd ClimaAPI
```
Execute a aplicação via Maven ou pela sua IDE

```
mvn spring-boot:run
```
Acesse no navegador

```
http://localhost:8080/clima
```