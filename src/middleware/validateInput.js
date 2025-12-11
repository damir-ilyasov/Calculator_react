const validateBMIInput = (req, res, next) => {
  const { height, weight } = req.body;
  
  if (!height || !weight) {
    return res.status(400).json({
      error: 'Необходимо указать рост и вес'
    });
  }
  
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  
  if (isNaN(heightNum) || isNaN(weightNum)) {
    return res.status(400).json({
      error: 'Рост и вес должны быть числами'
    });
  }
  
  if (heightNum <= 0 || weightNum <= 0) {
    return res.status(400).json({
      error: 'Рост и вес должны быть положительными числами'
    });
  }
  
  if (heightNum > 300) {
    return res.status(400).json({
      error: 'Рост не может быть больше 300 см'
    });
  }
  
  if (weightNum > 500) {
    return res.status(400).json({
      error: 'Вес не может быть больше 500 кг'
    });
  }
  
  // Добавляем проверенные данные в запрос
  req.validatedData = {
    height: heightNum,
    weight: weightNum
  };
  
  next();
};

export default validateBMIInput;