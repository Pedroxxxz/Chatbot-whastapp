const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Sistema de contextos
const userContexts = {};

function setUserContext(userId, context) {
    userContexts[userId] = {
        context: context,
        timestamp: Date.now()
    };
}

function getUserContext(userId) {
    return userContexts[userId]?.context || null;
}

client.on('qr', qr => {
    console.log('Escaneie o QR Code abaixo:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Guia de Museus de Olinda conectado com sucesso!');
});

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
    try {
        // Ignorar mensagens de grupos e transmissões
        if (msg.isGroup || msg.from.includes('@g.us') || msg.from.includes('@broadcast')) return;

        const userId = msg.from;
        const userMessage = msg.body ? msg.body.toLowerCase().trim() : '';
        const currentContext = getUserContext(userId);

        // Obter nome do contacto de forma segura
        let name = 'Visitante';
        try {
            const contact = await msg.getContact();
            name = contact.pushname || contact.name || 'Visitante';
        } catch (e) {
            // Caso falhe ao obter o contacto, mantém o padrão
        }

        // Função segura para envio de mensagens
        const safeSendMessage = async (message) => {
            try {
                await client.sendMessage(userId, message);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        };

        // ------------------------------------------------------
        // 1. MENU INICIAL
        // ------------------------------------------------------
        if (/^(oi|olá|ola|bom dia|boa tarde|boa noite|museus|menu|começar|start)$/i.test(userMessage)) {
            setUserContext(userId, null);

            await delay(1000);
            await safeSendMessage(
                `Olá ${name}! Seja bem-vindo(a) ao Guia de Museus de Olinda! \n\n` +
                'Posso ajudar você a conhecer alguns dos principais museus e espaços culturais da cidade.\n\n' +
                ' Museu Regional de Olinda\n' +
                ' Museu de Arte Sacra de Pernambuco\n' +
                ' Museu do Mamulengo\n\n' +
                'Você pode perguntar sobre a história, acervo, localização, horários ou ingresso.'
            );

            await delay(1500);
            await safeSendMessage('Qual museu ou informação você deseja consultar?');
            return;
        }

        // ------------------------------------------------------
        // 2. SELEÇÃO DE MUSEUS
        // ------------------------------------------------------

        // Museu Regional de Olinda
        if (/museu regional|mureo|regional de olinda/i.test(userMessage)) {
            setUserContext(userId, 'museu_regional');
            await delay(1000);
            await safeSendMessage(
                ' *Museu Regional de Olinda (MUREO)*\n\n' +
                'Localizado na Rua do Amparo, nº 128, o museu funciona em um solar colonial construído no século XVIII.\n\n' +
                ' *Destaque:* seu acervo reúne móveis, porcelanas e imagens sacras que ajudam a conhecer os costumes e a história de outras épocas.\n\n' +
                ' Funcionamento: terça a sexta, das 9h às 17h; sábados e domingos, das 14h às 17h.\n' +
                ' Entrada: gratuita.\n\n' +
                'Digite *menu* para consultar outro museu.'
            );
            return;
        }

        // Museu de Arte Sacra de Pernambuco
        if (/arte sacra|maspe|museu de arte sacra/i.test(userMessage)) {
            setUserContext(userId, 'museu_sacra');
            await delay(1000);
            await safeSendMessage(
                ' *Museu de Arte Sacra de Pernambuco (MASPE)*\n\n' +
                'Está localizado em um casarão histórico no topo do Sítio Histórico de Olinda e foi fundado em 1977.\n\n' +
                ' *Destaque:* possui um acervo de objetos de culto, pinturas religiosas, relicários, custódias e imagens de santos.\n\n' +
                ' Rua Bispo Coutinho, 726 – Carmo.\n' +
                ' Funcionamento: terça a sexta, das 10h às 17h; sábados e domingos, das 14h às 17h.\n' +
                ' Ingresso: R$ 5,00. Crianças até 12 anos, idosos acima de 60 anos e pessoas com deficiência têm gratuidade, conforme as informações do museu.\n\n' +
                'Digite *menu* para consultar outro museu.'
            );
            return;
        }

        // Museu do Mamulengo
        if (/mamulengo|museu do mamulengo/i.test(userMessage)) {
            setUserContext(userId, 'museu_mamulengo');
            await delay(1000);
            await safeSendMessage(
                ' *Museu do Mamulengo*\n\n' +
                'É um museu municipal de Olinda criado em 1994 e dedicado à preservação e valorização do mamulengo, importante manifestação do teatro popular.\n\n' +
                ' *Destaque:* o espaço preserva a memória e a cultura relacionada aos tradicionais bonecos do teatro popular pernambucano.\n\n' +
                ' Largo do Varadouro, s/n, Mercado Eufrásio Barbosa.\n' +
                ' Funcionamento: terça a sábado, das 9h às 13h.\n\n' +
                'Digite *menu* para consultar outro museu.'
            );
            return;
        }

        // ------------------------------------------------------
        // 3. ATENDIMENTO BASEADO NO CONTEXTO
        // ------------------------------------------------------

        if (currentContext === 'museu_regional') {
            if (/história|historia|acervo|o que tem|temática|tematica/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Sobre o Museu Regional de Olinda*\n\n' +
                    'O MUREO foi inaugurado em 1935 e está instalado em um solar colonial construído no século XVIII. Seu acervo possui móveis, porcelanas e imagens sacras, elementos que ajudam a representar os costumes e a história de uma época.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/onde|endereço|endereco|localização|localizacao/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Localização do Museu Regional de Olinda:*\n' +
                    'Rua do Amparo, nº 128 – Amparo, Olinda/PE.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/horário|horario|abre|funciona|fechado/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Horário do Museu Regional de Olinda:*\n' +
                    'Terça a sexta: 9h às 17h.\n' +
                    'Sábados e domingos: 14h às 17h.\n' +
                    'Segunda-feira: fechado.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }
        }

        if (currentContext === 'museu_sacra') {
            if (/história|historia|acervo|o que tem|temática|tematica/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '*Sobre o Museu de Arte Sacra de Pernambuco*\n\n' +
                    'Fundado em 1977, o MASPE reúne objetos de culto, pinturas religiosas, relicários, custódias e imagens de santos. O museu está instalado em um casarão histórico no Sítio Histórico de Olinda.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/onde|endereço|endereco|localização|localizacao/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Localização do MASPE:*\n' +
                    'Rua Bispo Coutinho, 726 – Carmo, Olinda/PE.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/horário|horario|abre|funciona|fechado/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Horário do MASPE:*\n' +
                    'Terça a sexta: 10h às 17h.\n' +
                    'Sábados e domingos: 14h às 17h.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }
        }

        if (currentContext === 'museu_mamulengo') {
            if (/história|historia|acervo|o que tem|temática|tematica/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '*Sobre o Museu do Mamulengo*\n\n' +
                    'Criado em 1994, o Museu do Mamulengo é uma instituição municipal dedicada ao mamulengo, manifestação tradicional do teatro popular. O espaço contribui para preservar a memória dessa expressão cultural.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/onde|endereço|endereco|localização|localizacao/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Localização do Museu do Mamulengo:*\n' +
                    'Largo do Varadouro, s/n – Mercado Eufrásio Barbosa, Olinda/PE.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/horário|horario|abre|funciona|fechado/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    ' *Horário do Museu do Mamulengo:*\n' +
                    'Terça a sábado: 9h às 13h.\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }
        }

        // ------------------------------------------------------
        // 4. RESPOSTA PADRÃO
        // ------------------------------------------------------
        await delay(1000);
        await safeSendMessage(
            'Desculpe, não consegui encontrar essa informação. 😅\n' +
            'Você pode perguntar pelo *Museu Regional de Olinda*, *Museu de Arte Sacra* ou *Museu do Mamulengo*.\n\n' +
            'Digite *menu* para voltar às opções.'
        );

    } catch (err) {
        console.error('Erro no processamento da mensagem:', err);
    }
});

// Limpeza automática de contextos antigos
setInterval(() => {
    const now = Date.now();
    for (const userId in userContexts) {
        if (now - userContexts[userId].timestamp > 30 * 60 * 1000) {
            delete userContexts[userId];
        }
    }
}, 5 * 60 * 1000);

client.initialize();
