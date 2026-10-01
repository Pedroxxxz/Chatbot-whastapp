# Guia de Museus de Olinda

Bot de WhatsApp desenvolvido em Node.js para responder dúvidas sobre museus e pontos culturais de Olinda/PE. O chatbot identifica o museu escolhido pelo usuário e oferece informações como história, localização, horários e acervo.

## Sobre o projeto

Este projeto usa a biblioteca `whatsapp-web.js` para conectar o bot ao WhatsApp Web e responder mensagens automáticas em tempo real. Ele foi pensado para funcionar como um guia virtual turístico, com foco em três instituições importantes da cidade:

- Museu Regional de Olinda (MUREO)
- Museu de Arte Sacra de Pernambuco (MASPE)
- Museu do Mamulengo

## Funcionalidades

- Recebe mensagens de clientes/visitantes no WhatsApp
- Exibe um menu inicial com opções de museus
- Identifica o contexto da conversa para responder perguntas específicas
- Explica história, localização e horários dos museus
- Mantém contexto por usuário em memória para melhorar a experiência
- Suporta resposta padrão para dúvidas fora do escopo

## Tecnologias utilizadas

- Node.js
- JavaScript
- whatsapp-web.js
- qrcode-terminal
- Puppeteer (embutido via whatsapp-web.js)

## Estrutura do projeto

```bash
chatbot/
├── README.md
├── package.json
├── robo.js
├── .wwebjs_auth/
├── .wwebjs_cache/
└── node_modules/
```

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18 ou superior
- npm
- Navegador Chrome/Chromium para o WhatsApp Web

## Instalação

No diretório do projeto, execute:

```bash
npm install whatsapp-web.js qrcode-terminal
```

Ou, se preferir instalar tudo de uma vez pela configuração do projeto:

```bash
npm install
```

> A dependência `qrcode-terminal` é necessária para gerar o QR Code no terminal e conectar o bot ao WhatsApp.

## Execução

Para iniciar o chatbot:

```bash
node robo.js
```

Ao executar, o terminal exibirá um QR Code. Escaneie com o WhatsApp no seu celular para conectar o chatbot ao seu número.

## Como usar

Após a autenticação, envie mensagens como:

- `oi`
- `museus`
- `menu`
- `Museu Regional de Olinda`
- `Museu de Arte Sacra`
- `Museu do Mamulengo`
- `horário`
- `localização`
- `história`

O bot responderá com informações sobre o museu selecionado ou com orientação para continuar a conversa.

## Exemplo de conversa

```text
Usuário: oi
Bot: Olá! Seja bem-vindo(a) ao Guia de Museus de Olinda!

Usuário: Museu Regional de Olinda
Bot: Exibe informações do MUREO...

Usuário: horário
Bot: Terça a sexta: 9h às 17h.
```

## Observações

- O projeto usa `LocalAuth`, então as sessões do WhatsApp ficam armazenadas localmente.
- O diretório `.wwebjs_auth` e `.wwebjs_cache` pode ser limpo em caso de problema de autenticação.
- O bot ignora mensagens de grupos e transmissões.

## Licença

Este projeto está licenciado sob a licença ISC.

## Autor

Projeto desenvolvido para uso educativo e demonstrativo como guia turístico automatizado de Olinda.
