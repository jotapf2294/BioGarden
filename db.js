// db.js - Gestão de base de dados local
const DB_NAME = 'BioGardenPro';
const DB_VERSION = 1;

const db = {
    _instance: null,
    async init() {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const _db = e.target.result;
                // Store para as plantas plantadas
                _db.createObjectStore('garden', { keyPath: 'id', autoIncrement: true });
                // Store para a Wiki personalizada
                _db.createObjectStore('wiki', { keyPath: 'id', autoIncrement: true });
                // Store para configurações e zonas
                _db.createObjectStore('settings', { keyPath: 'key' });
            };
            request.onsuccess = (e) => { this._instance = e.target.result; resolve(); };
        });
    },

    async add(store, data) {
        const tx = this._instance.transaction(store, 'readwrite');
        return tx.objectStore(store).add(data);
    },

    async getAll(store) {
        return new Promise(res => {
            const tx = this._instance.transaction(store, 'readonly');
            tx.objectStore(store).getAll().onsuccess = (e) => res(e.target.result);
        });
    },

    async delete(store, id) {
        const tx = this._instance.transaction(store, 'readwrite');
        tx.objectStore(store).delete(id);
    }
};
      
