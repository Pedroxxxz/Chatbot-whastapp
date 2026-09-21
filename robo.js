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
    console.log('Bot WhatsApp conectado com sucesso!');
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
        let name = 'Cliente';
        try {
            const contact = await msg.getContact();
            name = contact.pushname || contact.name || 'Cliente';
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
        if (/^(oi|olá|ola|bom dia|boa tarde|boa noite|produtos|menu|começar|start)$/i.test(userMessage)) {
            setUserContext(userId, null);
            
            await delay(1000);
            await safeSendMessage(
                `Olá ${name}! Seja bem-vindo(a) à nossa loja! 🏪\n\n` +
                'Temos diversos produtos incríveis para você! Confira nossas categorias:\n\n' +
                '🎮 Placas de Vídeo\n' +
                '⌨️ Teclados Mecânicos\n' +
                '🖱️ Mouses\n' +
                '💾 Memórias RAM\n' +
                '🔧 Placas-mãe\n' +
                '💻 Processadores'
            );

            await delay(1500);
            await safeSendMessage('Qual categoria você deseja consultar?');
            return;
        }

        // ------------------------------------------------------
        // 2. SELEÇÃO DE CATEGORIAS
        // ------------------------------------------------------

        // Teclados
        if (/teclado|teclados/i.test(userMessage)) {
            setUserContext(userId, 'teclados');
            await delay(1000);
            await safeSendMessage(
                '⌨️ *Teclados Mecânicos Disponíveis:*\n\n' +
                '1. Redragon Kumara\n' +
                '2. Logitech G213\n\n' +
                'Digite o nome do modelo para ver detalhes e valor!'
            );
            return;
        }

        // Mouses
        if (/mouses|mouse/i.test(userMessage)) {
            setUserContext(userId, 'mouses');
            await delay(1000);
            await safeSendMessage(
                '🖱️ *Mouses Disponíveis:*\n\n' +
                '1. Redragon Cobra\n' +
                '2. Havit MS1029\n\n' +
                'Digite o nome do mouse desejado para mais informações!'
            );
            return;
        }

        // Placas de Vídeo
        if (/placa de video|placa de vídeo|placas de video|placas de vídeo/i.test(userMessage)) {
            setUserContext(userId, 'placas_video');
            await delay(1000);
            await safeSendMessage(
                '🎮 *Placas de Vídeo Disponíveis:*\n\n' +
                '1. GTX 1660 Super\n' +
                '2. GTX 1650\n\n' +
                'Digite o nome da placa para ver as especificações e preço!'
            );
            return;
        }

        // ------------------------------------------------------
        // 3. ATENDIMENTO BASEADO NO CONTEXTO
        // ------------------------------------------------------

        if (currentContext === 'placas_video') {
            if (/1660|gtx 1660|mancer/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '🎮 *Mancer GTX 1660 Super Heimdall 6GB*\n' +
                    '• VRAM: 6GB GDDR6\n' +
                    '• Conectores: HDMI / DisplayPort / DVI\n' +
                    '• Preço: R$ 1.215,00 à vista\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/1650|gtx 1650|galax/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '🎮 *Nvidia Galax GTX 1650 4GB*\n' +
                    '• VRAM: 4GB GDDR5\n' +
                    '• Conectores: HDMI / DisplayPort\n' +
                    '• Preço: R$ 1.189,00 à vista\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }
        }

        if (currentContext === 'mouses') {
            if (/cobra|redragon/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '🖱️ *Redragon Cobra Chroma M711*\n' +
                    '• DPI: Até 10.000 DPI\n' +
                    '• Iluminação: RGB Chroma\n' +
                    '• Preço: R$ 130,00\n\n' +
                    'Digite *menu* para voltar ao início.'
                );
                return;
            }

            if (/havit|1029/i.test(userMessage)) {
                await delay(1000);
                await safeSendMessage(
                    '🖱️ *Havit MS1029*\n' +
                    '• DPI: 2400 DPI\n' +
                    '• Preço: R$ 69,90\n\n' +
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
            'Desculpe, não entendi. 😅\n' +
            'Digite o nome do produto desejado ou envie *menu* para voltar às opções.'
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

