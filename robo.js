//CONFIGURAÇÕES


// Ativar permições
const qrcode = require('qrcode-terminal');  //Permite gerar QRCODE para conectar com whatsapp
const { Client } = require('whatsapp-web.js');  //Automatizar o envio de mensagens
const { MessageMedia } = require('whatsapp-web.js');  // Para enviar mídia (fotos, vídeos, PDFs)






// Configuração pra rodar a biblioteca do whatsapp-web
const client = new Client({
    puppeteer: {    //Permite o uso de um navegador sem interface gráfica
        headless: true,
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


// Configuração do QR Code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
    console.log('Bot WhatsApp conectado!');
});




//Delay e receber mensagens
const delay = ms => new Promise(res => setTimeout(res, ms));


client.on('message', async msg => {






    // PROTEÇÃO PARA NÃO ENVIAR EM GRUPOS DO WHATSAPP CONECTADO


    // Verificações de segurança
    if (msg.isGroup) return;
    if (!msg.from.endsWith('@c.us')) return;
    const chat = await msg.getChat();
    if (chat.isGroup) return;


    const userId = msg.from;
    const userMessage = msg.body.toLowerCase();
    const currentContext = getUserContext(userId);
    const contact = await msg.getContact();
    const name = contact.pushname;


    // Função segura para envio
    const safeSendMessage = async (message) => {
        const finalChat = await msg.getChat();
        if (finalChat.isGroup) return;
        if (!msg.from.endsWith('@c.us')) return;
        try {
            await client.sendMessage(msg.from, message);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };




    // FIM DAS CONFIGURAÇÕES


    //------------------------------------------------------






    // MENU INICIAL


    if (/oi|olá|ola|bom dia|boa tarde|boa noite|produtos|menu|começar|start/i.test(userMessage)) {
        setUserContext(userId, null);
        await delay(1000);//entendendo a mensagem
        await chat.sendStateTyping();//mostra palavra "digitando..."
        await delay(2000); // Tempo de enviar a mensagem
        await safeSendMessage(`Olá ${name}! Seja bem-vindo(a) à nossa loja! 🏪\n\n` +
            'Temos diversos produtos incríveis para você! Confira nossas categorias:\n\n' +
            '🎮 Placas de Vídeo\n' +
            '⌨️ Teclados Mecânicos\n' +
            '🖱️ Mouses\n' +
            '💾 Memórias RAM\n' +
            '🔧 Placas-mãe\n' +
            '💻 Processadores');




        //Precisa testar, se vai vim segunda mensagem depois de boas vindas
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);
        await safeSendMessage('Qual produto vc deseja?');
        return;
    }


    // FIM DO MENU INICIAL


    //------------------------------------------------------




    // SELEÇÃO DE CATEGORIAS COM LISTA DE PRODUTOS




    //palavras chave de ativação da categoria
    if (/teclado|teclados/i.test(userMessage)) {
        setUserContext(userId, 'teclados');
        await delay(1000); //entendendo a mensagem, evita que a mensagem seja enviada na hora.
        await chat.sendStateTyping(); //mostra palavra "digitando..."
        await delay(2000); // Tempo de enviar a mensagem
        await safeSendMessage('⌨️ Teclados Mecânicos Disponíveis:');
        return;
    }




    //palavras chave de ativação da categoria
    if (/detalhes do produto|mouses/i.test(userMessage)) {
        setUserContext(userId, 'mouses');
        await delay(1000);
        await chat.sendStateTyping();
        await delay(2000);
        await safeSendMessage('🖱️ Mouses Disponíveis:\n\n' +
            '1. Redragon Cobra Chroma M711 - R$ 130\n' +
            '2. Havit Ms1029 - R$ 69,90\n\n' +
            'Digite o nome do mouse ou marca que deseja mais informações!');
        return;
    }




    //palavras chave de ativação da categoria
    if (/placa de video|placa de vídeo|placas de video|placas de vídeo|placa video|placa vídeo/i.test(userMessage)) {
        setUserContext(userId, 'placas_video');
        await delay(1000);
        await chat.sendStateTyping();
        await delay(2000);
        await safeSendMessage('🎮 Placas de Vídeo Disponíveis:\n\n' +
            '1. Mancer GTX 1660 Super Heimdall 6GB - R$ 1.215\n' +
            '2. Nvidia Galax GTX 1650 4GB - R$ 1.189\n\n' +
            'Digite o nome da placa ou marca que deseja mais informações!');
        return;
    }




    //palavras chave de ativação da categoria
    if (/meroria ram|Memórias RAM|ram/i.test(userMessage)) {
        setUserContext(userId, 'memorias_ram');
        await delay(2000);
        await chat.sendStateTyping();
        await delay(4000);
        await safeSendMessage('Memórias RAMs Disponíveis:\n\n' +
            '1. Memória Ram 16gb 3200mhz Ddr4 Vengeance Rgb Rs Corsair - R$ 272\n\n' +
            'Digite o nome do teclado ou marca que deseja mais informações!');
        return;
    }




    //Palavras chave de ativação da categoria
    if (/Placas-mãe|placa mae|placa mãe|placas mãe/i.test(userMessage)) {
        setUserContext(userId, 'placas_mae');
        await delay(1000);
        await chat.sendStateTyping();
        await delay(2000);
        await safeSendMessage('Placas-mães Disponíveis:\n\n' +
            '1. Gigabyte P/ Amd Am4 B450m Gaming 2xddr4 Matx - R$ 521,46\n\n' +
            'Digite o nome do teclado ou marca que deseja mais informações!');
        return;
    }




    //palavras chave de ativação da categoria
    if (/processador|processadores/i.test(userMessage)) {
        setUserContext(userId, 'processadores');
        await delay(1000);
        await chat.sendStateTyping();
        await delay(2000);
        await safeSendMessage('Processadores Disponíveis:\n\n' +
            '1. Intel Core i5-4590 de 4 núcleos e 3.7GHz de frequência com gráfica integrada - R$178\n\n' +
            'Digite o nome do teclado ou marca que deseja mais informações!');
        return;
    }




}
);




// Limpeza automática de contextos antigos
setInterval(() => {
    const now = Date.now();
    for (const userId in userContexts) {
        if (now - userContexts[userId].timestamp > 30 * 60 * 1000) { // 30 minutos
            delete userContexts[userId];
        }
    }
}, 5 * 60 * 1000); // Verifica a cada 5 minutos


client.initialize();
