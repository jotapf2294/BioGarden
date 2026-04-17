const App = {
    async init() {
        await db.init();
        this.render('dashboard');
    },

    // --- SISTEMA DE BACKUP COMPLETO ---
    async exportData() {
        const garden = await db.getAll('garden');
        const wiki = await db.getAll('wiki');
        const backup = {
            version: 1.0,
            timestamp: new Date().toISOString(),
            data: { garden, wiki }
        };
        
        const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `biogarden_backup_${Date.now()}.json`;
        a.click();
    },

    // --- FUNÇÕES EXTRA: CÁLCULO DE COLHEITA ---
    calculateHarvest(datePlanted, cycleDays) {
        const start = new Date(datePlanted);
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(cycleDays));
        
        const hoje = new Date();
        const diffTime = end - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            dataFinal: end.toLocaleDateString(),
            diasFaltam: diffDays > 0 ? diffDays : 0,
            percent: Math.min(100, Math.max(0, ((hoje - start) / (end - start)) * 100))
        };
    },

    async render(view) {
        const main = document.getElementById('app');
        if(view === 'garden') {
            const plantas = await db.getAll('garden');
            main.innerHTML = `
                <div class="header">
                    <h2>Minha Horta</h2>
                    <button onclick="openModal()">+ Adicionar</button>
                </div>
                <div id="list">
                    ${plantas.map(p => {
                        const h = this.calculateHarvest(p.data, p.ciclo);
                        return `
                            <div class="plant-card">
                                <span class="zone-tag">${p.zona}</span>
                                <h3>${p.nome} <small>(${p.strain})</small></h3>
                                <div class="progress-container">
                                    <div class="progress-bar" style="width:${h.percent}%"></div>
                                </div>
                                <p>Faltam <strong>${h.diasFaltam} dias</strong> para a colheita (${h.dataFinal})</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        // ... Logica para Wiki e Dashboard
    }
};

window.onload = () => App.init();
                                                                  
