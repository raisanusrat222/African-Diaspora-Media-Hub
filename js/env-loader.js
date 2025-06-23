// Simple environment loader for dev

class EnvLoader {
    constructor() {
        this.config = {};
        this.isProduction = window.location.protocol === 'https:' && 
                          !window.location.hostname.includes('localhost') &&
                          !window.location.hostname.includes('127.0.0.1');
    }
    
    async loadConfig() {
        if (this.isProduction) {
            // Production: Load from backend/serverless function
            return await this.loadFromAPI();
        } else {
            // Development: Use config.js file 
            return await this.loadFromConfigFile();
        }
    }
    
    async loadFromConfigFile() {
        try {
            // Try to load from local config file
            const configModule = await import('./config.js');
            return configModule.default || configModule;
        } catch (error) {
            console.warn('No config.js found. Using prompt method for development.');
            return this.promptForConfig();
        }
    }
    
    async loadFromAPI() {
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not load config from API:', error);
        }
        return null;
    }
    
    promptForConfig() {
        const apiKey = prompt(`
🔐 DEVELOPMENT SETUP

Enter your OpenAI API key:

This will be saved locally for development only.
        `.trim());
        
        if (apiKey && apiKey.startsWith('sk-')) {
            // Save to localStorage for convenience
            localStorage.setItem('dev_openai_key', apiKey);
            return { OPENAI_API_KEY: apiKey };
        }
        
        return null;
    }
    
    getStoredKey() {
        return localStorage.getItem('dev_openai_key');
    }
    
    clearStoredKey() {
        localStorage.removeItem('dev_openai_key');
    }
}

window.EnvLoader = new EnvLoader();