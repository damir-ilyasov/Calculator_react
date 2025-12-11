import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let bmiRoutes;
try {

  bmiRoutes = (await import('./src/routes/bmiRoutes.js')).default;
} catch (error) {
  console.log('Не нашел routes в src, пробую в корне...');
  try {

    bmiRoutes = (await import('./routes/bmiRoutes.js')).default;
  } catch (err) {
    console.error('Не удалось найти модуль routes');
    bmiRoutes = express.Router();
    bmiRoutes.post('/calculate', (req, res) => {
      const { height, weight } = req.body;
      if (!height || !weight) {
        return res.status(400).json({ error: 'Укажите рост и вес' });
      }
      const bmi = (weight / ((height/100) ** 2)).toFixed(1);
      res.json({ bmi, height, weight });
    });
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/bmi', bmiRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API работает!', timestamp: new Date().toISOString() });
});

app.get('/api/bmi/category/:value', (req, res) => {
  const bmi = parseFloat(req.params.value);
  let category = 'Неизвестно';
  
  if (bmi < 18.5) category = 'Недостаточный вес';
  else if (bmi < 25) category = 'Нормальный вес';
  else if (bmi < 30) category = 'Избыточный вес';
  else category = 'Ожирение';
  
  res.json({ bmi, category });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Веб-интерфейс: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/bmi`);
  console.log(`rТест API: http://localhost:${PORT}/api/test`);
});