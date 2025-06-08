# 🤖 Chatbot AI - Guida alla Configurazione

## Panoramica

Il chatbot AI integrato nel portfolio utilizza l'API di OpenAI per fornire risposte intelligenti e contestuali ai visitatori. Il sistema include un fallback con risposte predefinite quando l'API non è disponibile.

## ✨ Caratteristiche

- **Risposte AI intelligenti** usando GPT-3.5-turbo
- **Fallback automatico** con risposte predefinite
- **Interfaccia moderna** con animazioni fluide
- **Responsive design** ottimizzato per mobile
- **Gestione sicura** delle API key
- **Cronologia conversazione** mantenuta durante la sessione

## 🚀 Configurazione Rapida

### 1. Ottieni una API Key OpenAI

1. Vai su [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea un account o accedi
3. Genera una nuova API key
4. **IMPORTANTE**: Copia e salva la chiave in un posto sicuro

### 2. Configura il Chatbot

Apri la console del browser (F12) e esegui:

```javascript
// Configura la tua API key
ChatbotConfig.setApiKey("sk-your-api-key-here");

// Verifica la configurazione
ChatbotConfig.isConfigured(); // dovrebbe restituire true
```

### 3. Testa il Chatbot

- Clicca sull'icona del chatbot in basso a destra
- Scrivi un messaggio di prova
- Il chatbot dovrebbe rispondere usando l'AI

## 🛠️ Comandi Console Utili

```javascript
// Mostra le istruzioni complete
ChatbotConfig.showInstructions();

// Verifica se è configurato
ChatbotConfig.isConfigured();

// Rimuovi l'API key
ChatbotConfig.removeApiKey();

// Riconfigura con una nuova chiave
ChatbotConfig.setApiKey("nuova-chiave");
```

## 🔧 Personalizzazione

### Modifica il Prompt di Sistema

Nel file `script.js`, cerca il metodo `initializeSystemPrompt()` per personalizzare:
- Informazioni aziendali
- Servizi offerti
- Prezzi
- Stile di risposta

### Modifica le Risposte di Fallback

Nel metodo `generateFallbackResponse()` puoi aggiornare le risposte predefinite per quando l'API non è disponibile.

### Personalizza l'Aspetto

Nel file `styles.css`, cerca le regole CSS che iniziano con `#chatbot-` per modificare:
- Colori
- Dimensioni
- Animazioni
- Posizionamento

## 🔒 Sicurezza

### ⚠️ IMPORTANTE - Gestione API Key

**Per sviluppo/test:**
- L'API key è salvata nel localStorage del browser
- È visibile a chiunque abbia accesso al browser
- Adatta solo per test locali

**Per produzione:**
- **MAI** esporre l'API key nel frontend
- Implementa un backend proxy che gestisce le chiamate API
- Usa variabili d'ambiente per le chiavi
- Implementa rate limiting e autenticazione

### Esempio Backend Proxy (Node.js)

```javascript
// server.js
app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
});
```

## 📱 Funzionalità Mobile

- **Responsive**: Si adatta automaticamente agli schermi piccoli
- **Touch-friendly**: Pulsanti ottimizzati per il tocco
- **Posizionamento**: Non interferisce con altri elementi UI

## 🐛 Risoluzione Problemi

### Il chatbot non risponde
1. Verifica che l'API key sia configurata: `ChatbotConfig.isConfigured()`
2. Controlla la console per errori
3. Verifica la connessione internet
4. Controlla i crediti OpenAI rimanenti

### Risposte solo predefinite
- L'API key potrebbe essere scaduta o non valida
- Potrebbero esserci problemi di rete
- Il servizio OpenAI potrebbe essere temporaneamente non disponibile

### Problemi di visualizzazione
- Svuota la cache del browser
- Verifica che tutti i file CSS e JS siano caricati
- Controlla la console per errori JavaScript

## 💰 Gestione Costi

### Monitoraggio Uso
- Controlla regolarmente l'uso su [OpenAI Usage](https://platform.openai.com/usage)
- Imposta limiti di spesa nel dashboard OpenAI
- Monitora il numero di token utilizzati

### Ottimizzazione Costi
- Usa `max_tokens: 500` per limitare le risposte
- Mantieni solo gli ultimi 10 messaggi nella cronologia
- Implementa rate limiting per prevenire abusi

## 🔄 Aggiornamenti Futuri

### Funzionalità Pianificate
- [ ] Integrazione con altri provider AI (Claude, Gemini)
- [ ] Supporto per file upload
- [ ] Analisi sentiment delle conversazioni
- [ ] Dashboard amministratore
- [ ] Integrazione CRM

### Miglioramenti Tecnici
- [ ] Service Worker per funzionalità offline
- [ ] Compressione messaggi per ridurre token
- [ ] Caching intelligente delle risposte
- [ ] A/B testing per ottimizzare le conversioni

## 📞 Supporto

Per problemi o domande:
- 📧 Email: support@devninja.it
- 💬 Chat: Usa il chatbot stesso per test!
- 📚 Documentazione: Questo file README

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Dicembre 2024  
**Compatibilità**: Tutti i browser moderni