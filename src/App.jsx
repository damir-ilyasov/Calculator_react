// Базовый URL API
const API_URL = '/api/bmi';

// DOM элементы
const elements = {
    height: document.getElementById('height'),
    weight: document.getElementById('weight'),
    calculateBtn: document.getElementById('calculateBtn'),
    result: document.getElementById('result'),
    getHistoryBtn: document.getElementById('getHistoryBtn'),
    getStatsBtn: document.getElementById('getStatsBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    dataDisplay: document.getElementById('dataDisplay')
};

// Расчет ИМТ
elements.calculateBtn.addEventListener('click', async () => {
    const height = elements.height.value;
    const weight = elements.weight.value;

    if (!height || !weight) {
        showError('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ height, weight })
        });

        const data = await response.json();

        if (data.success) {
            const { bmi, category, risk } = data.data;
            
            let categoryClass = 'category-normal';
            if (category.includes('Недостаточный')) categoryClass = 'category-underweight';
            else if (category.includes('Избыточный')) categoryClass = 'category-overweight';
            else if (category.includes('Ожирение')) categoryClass = 'category-obese';
            
            elements.result.innerHTML = `
                <div class="data-item ${categoryClass}">
                    <h3>🎯 Результат расчета</h3>
                    <p><strong>ИМТ:</strong> ${bmi}</p>
                    <p><strong>Категория:</strong> ${category}</p>
                    <p><strong>Риск для здоровья:</strong> ${risk}</p>
                    <p><small>Рост: ${height} см, Вес: ${weight} кг</small></p>
                </div>
            `;
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError('Ошибка при расчете ИМТ');
    }
});

// Получение истории
elements.getHistoryBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/history?limit=5`);
        const data = await response.json();

        if (data.success) {
            displayHistory(data.data, data.pagination);
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError('Ошибка при получении истории');
    }
});

// Получение статистики
elements.getStatsBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        if (data.success) {
            const stats = data.data;
            elements.dataDisplay.innerHTML = `
                <div class="data-item">
                    <h3>📈 Статистика</h3>
                    <p><strong>Всего расчетов:</strong> ${stats.totalCalculations}</p>
                    <p><strong>Средний ИМТ:</strong> ${stats.averageBMI}</p>
                    <p><strong>Наиболее частая категория:</strong> ${stats.mostCommonCategory}</p>
                </div>
            `;
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError('Ошибка при получении статистики');
    }
});

// Очистка истории
elements.clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('Вы уверены, что хотите очистить всю историю расчетов?')) {
        try {
            const response = await fetch(`${API_URL}/history`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                alert(data.message);
                elements.dataDisplay.innerHTML = '';
            } else {
                showError(data.error);
            }
        } catch (error) {
            showError('Ошибка при очистке истории');
        }
    }
});

// Функции помощники
function displayHistory(history, pagination) {
    if (history.length === 0) {
        elements.dataDisplay.innerHTML = '<p>История расчетов пуста</p>';
        return;
    }

    let html = `
        <div class="data-item">
            <h3>📋 История расчетов (${history.length} из ${pagination.total})</h3>
        </div>
    `;

    history.forEach(item => {
        let categoryClass = 'category-normal';
        if (item.category.includes('Недостаточный')) categoryClass = 'category-underweight';
        else if (item.category.includes('Избыточный')) categoryClass = 'category-overweight';
        else if (item.category.includes('Ожирение')) categoryClass = 'category-obese';
        
        const date = new Date(item.timestamp).toLocaleString('ru-RU');
        
        html += `
            <div class="data-item ${categoryClass}">
                <p><strong>ИМТ:</strong> ${item.bmi}</p>
                <p><strong>Категория:</strong> ${item.category}</p>
                <p><strong>Риск:</strong> ${item.risk}</p>
                <p><small>Рост: ${item.height} см, Вес: ${item.weight} кг</small></p>
                <p><small><em>${date}</em></small></p>
            </div>
        `;
    });

    elements.dataDisplay.innerHTML = html;
}

function showError(message) {
    elements.dataDisplay.innerHTML = `
        <div class="data-item" style="border-left-color: #f56565;">
            <h3>❌ Ошибка</h3>
            <p>${message}</p>
        </div>
    `;
}