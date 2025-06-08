// Configurazione Chatbot AI
// IMPORTANTE: Questo file contiene configurazioni sensibili

class ChatbotConfig {
    constructor() {
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 500;
        this.temperature = 0.7;
        this.presencePenalty = 0.1;
        this.frequencyPenalty = 0.1;
    }
    
    // Metodo per configurare l'API key
    setApiKey(apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('API Key non può essere vuota');
        }
        
        // Salva in localStorage (solo per demo - in produzione usare backend sicuro)
        localStorage.setItem('openai_api_key', apiKey.trim());
        console.log('✅ API Key configurata con successo!');
    }
    
    // Metodo per ottenere l'API key
    getApiKey() {
        const apiKey = localStorage.getItem('openai_api_key');
        if (!apiKey) {
            throw new Error('API Key non configurata. Usa ChatbotConfig.setApiKey("your-key") per configurarla.');
        }
        return apiKey;
    }
    
    // Metodo per rimuovere l'API key
    removeApiKey() {
        localStorage.removeItem('openai_api_key');
        console.log('🗑️ API Key rimossa');
    }
    
    // Verifica se l'API key è configurata
    isConfigured() {
        return !!localStorage.getItem('openai_api_key');
    }
    
    // Mostra istruzioni di configurazione
    showInstructions() {
        console.log(`
🤖 CONFIGURAZIONE CHATBOT AI

1. Ottieni una API Key da OpenAI:
   https://platform.openai.com/api-keys

2. Configura la chiave:
   ChatbotConfig.setApiKey("sk-your-api-key-here")

3. Verifica la configurazione:
   ChatbotConfig.isConfigured()

⚠️ IMPORTANTE:
- Non condividere mai la tua API Key
- In produzione, gestisci le chiavi tramite backend sicuro
- Monitora l'uso per evitare costi eccessivi

💡 Per testare senza API Key, il chatbot userà risposte predefinite.
`);
    }
}

// Crea istanza globale
window.ChatbotConfig = new ChatbotConfig();

// Mostra istruzioni al caricamento
if (!window.ChatbotConfig.isConfigured()) {
    console.log('⚠️ Chatbot AI non configurato. Usa ChatbotConfig.showInstructions() per vedere come configurarlo.');
}