let bmiHistory = [];

const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category;
  let risk;
  
  if (bmi < 18.5) {
    category = 'Недостаточный вес';
    risk = 'Низкий';
  } else if (bmi < 25) {
    category = 'Нормальный вес';
    risk = 'Средний';
  } else if (bmi < 30) {
    category = 'Избыточный вес';
    risk = 'Повышенный';
  } else if (bmi < 35) {
    category = 'Ожирение I степени';
    risk = 'Высокий';
  } else if (bmi < 40) {
    category = 'Ожирение II степени';
    risk = 'Очень высокий';
  } else {
    category = 'Ожирение III степени';
    risk = 'Чрезвычайно высокий';
  }
  
  return {
    bmi: bmi.toFixed(1),
    category,
    risk,
    height,
    weight,
    timestamp: new Date().toISOString()
  };
};

export const calculate = async (req, res) => {
  try {
    const { height, weight } = req.validatedData;
    const result = calculateBMI(height, weight);
    
    bmiHistory.push(result);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in calculate:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при расчете ИМТ'
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedHistory = bmiHistory.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        page,
        limit,
        total: bmiHistory.length,
        totalPages: Math.ceil(bmiHistory.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении истории'
    });
  }
};

export const getStats = async (req, res) => {
  try {
    if (bmiHistory.length === 0) {
      return res.json({
        success: true,
        data: {
          totalCalculations: 0,
          averageBMI: 0,
          mostCommonCategory: 'Нет данных'
        }
      });
    }
    
    const totalBMI = bmiHistory.reduce((sum, item) => sum + parseFloat(item.bmi), 0);
    const averageBMI = (totalBMI / bmiHistory.length).toFixed(1);
    
    const categoryCount = {};
    bmiHistory.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );
    
    res.json({
      success: true,
      data: {
        totalCalculations: bmiHistory.length,
        averageBMI,
        mostCommonCategory
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики'
    });
  }
};

export const clearHistory = async (req, res) => {
  try {
    bmiHistory = [];
    res.json({
      success: true,
      message: 'История расчетов очищена'
    });
  } catch (error) {
    console.error('Error in clearHistory:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при очистке истории'
    });
  }
};

export default {
  calculate,
  getHistory,
  getStats,
  clearHistory
};