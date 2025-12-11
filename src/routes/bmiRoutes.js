import express from 'express';
import bmiController from '../controllers/bmiController.js';
import validateBMIInput from '../middleware/validateInput.js';

const router = express.Router();

router.post('/calculate', validateBMIInput, bmiController.calculate);
router.get('/history', bmiController.getHistory);
router.get('/stats', bmiController.getStats);
router.delete('/history', bmiController.clearHistory);

router.get('/category/:bmiValue', (req, res) => {
  const bmiValue = parseFloat(req.params.bmiValue);
  
  if (isNaN(bmiValue)) {
    return res.status(400).json({
      error: 'Некорректное значение ИМТ'
    });
  }
  
  let category;
  if (bmiValue < 18.5) category = 'Недостаточный вес';
  else if (bmiValue < 25) category = 'Нормальный вес';
  else if (bmiValue < 30) category = 'Избыточный вес';
  else category = 'Ожирение';
  
  res.json({
    bmi: bmiValue,
    category
  });
});

export default router;