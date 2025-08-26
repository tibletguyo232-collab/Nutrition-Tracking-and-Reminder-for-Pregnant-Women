
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/users'; 

  //  Redirect to login 
  function redirectToLogin(message) {
    if (message) alert(message);
    window.location.href = 'login.html'; 
  }

  // Redirect if no token 
  if (!token) {
    redirectToLogin('Please log in first.');
    return;
  }

  let userProfile = {};
  let savedIntake = [];

  const containers = {
    Breakfast: document.getElementById('breakfast-container'),
    Lunch: document.getElementById('lunch-container'),
    Snack: document.getElementById('snack-container'),
    Dinner: document.getElementById('dinner-container')
  };

  const saveBtn = document.getElementById('save-intake');

  //  Fetch User Profile 
  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: 'Bearer ' + token }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      redirectToLogin('Session expired. Please log in again.');
      return;
    }

    if (!res.ok) throw new Error('Failed to fetch profile');
    userProfile = await res.json();
  } catch (err) {
    console.error(err);
    redirectToLogin('Server error. Please log in again.');
    return;
  }

  // Load Saved Intake 
  async function loadSavedIntake() {
    try {
      const res = await fetch(`${API_URL}/intake`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) {
        console.warn('Could not fetch intake data');
        savedIntake = [];
        return;
      }
      const intakeRecords = await res.json();
      const today = new Date().toLocaleDateString('en-CA');
      const todayRecord = intakeRecords.find(
        rec => new Date(rec.date).toLocaleDateString('en-CA') === today
      );
      savedIntake = todayRecord ? todayRecord.meals : [];
    } catch (err) {
      console.error('Failed to fetch saved intake', err);
      savedIntake = [];
    }
  }

  // Meal Data 
  const meals = [
    { id: 1, name: 'Oatmeal', type: 'Breakfast', image: 'https://via.placeholder.com/200x120', time: '08:00', calories: 150, protein: 5, carbs: 27, fats: 3, sodium: 50 },
    { id: 2, name: 'Egg Sandwich', type: 'Breakfast', image: 'https://via.placeholder.com/200x120', time: '08:30', calories: 220, protein: 12, carbs: 25, fats: 8, sodium: 300 },
    { id: 3, name: 'Chicken Salad', type: 'Lunch', image: 'https://via.placeholder.com/200x120', time: '12:30', calories: 250, protein: 30, carbs: 10, fats: 12, sodium: 400 },
    { id: 4, name: 'Grilled Salmon', type: 'Dinner', image: 'https://via.placeholder.com/200x120', time: '19:00', calories: 300, protein: 35, carbs: 0, fats: 20, sodium: 120 },
    { id: 5, name: 'Almonds', type: 'Snack', image: 'https://via.placeholder.com/200x120', time: '15:30', calories: 100, protein: 4, carbs: 6, fats: 9, sodium: 0 },
    { id: 6, name: 'Fruit Yogurt', type: 'Snack', image: 'https://via.placeholder.com/200x120', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 }
  ];

  // Render Meals
  async function renderMeals() {
    await loadSavedIntake();
    Object.keys(containers).forEach(type => containers[type].innerHTML = '');

    meals.forEach(meal => {
      const div = document.createElement('div');
      div.classList.add('meal-card', meal.type.toLowerCase());
      div.dataset.type = meal.type;

      const savedMeal = savedIntake.find(m => Number(m.mealId) === meal.id);

      div.innerHTML = `
        <div class="meal-icon">
          ${meal.type === 'Breakfast' ? '<i class="fa-solid fa-sun"></i>' :
            meal.type === 'Lunch' ? '<i class="fa-solid fa-utensils"></i>' :
            meal.type === 'Snack' ? '<i class="fa-solid fa-coffee"></i>' :
            '<i class="fa-solid fa-moon"></i>'}
        </div>
        <img src="${meal.image}" alt="${meal.name}">
        <p>${meal.name} (${meal.calories} kcal)</p>
        <label>Time: <input type="time" value="${savedMeal ? savedMeal.time : meal.time}" class="meal-time-input"></label>
        <label>
          <input type="checkbox" data-id="${meal.id}"
            data-calories="${meal.calories}"
            data-protein="${meal.protein}"
            data-carbs="${meal.carbs}"
            data-fats="${meal.fats}"
            data-sodium="${meal.sodium}"
            ${savedMeal ? 'checked' : ''} /> Select
        </label>
      `;

      containers[meal.type].appendChild(div);
    });

    updateSummary();
  }

  // Update Summary 
  function updateSummary() {
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0, totalSodium = 0;

    document.querySelectorAll('.meal-card input[type="checkbox"]:checked').forEach(cb => {
      totalCalories += +cb.dataset.calories;
      totalProtein += +cb.dataset.protein;
      totalCarbs += +cb.dataset.carbs;
      totalFats += +cb.dataset.fats;
      totalSodium += +cb.dataset.sodium;
    });

    document.getElementById('total-calories').textContent = totalCalories;
    document.getElementById('total-protein').textContent = totalProtein;
    document.getElementById('total-carbs').textContent = totalCarbs;
    document.getElementById('total-fats').textContent = totalFats;
    document.getElementById('total-sodium').textContent = totalSodium;

    const goalCalories = 2000;
    const progressPercent = Math.min((totalCalories / goalCalories) * 100, 100);
    document.getElementById('calories-bar').style.width = `${progressPercent}%`;
  }

  // Event Delegation
  document.querySelector('.container').addEventListener('change', (e) => {
    if (e.target.matches('.meal-card input[type="checkbox"]')) updateSummary();
  });

  //Save Intake
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;

    const selectedMeals = [];
    document.querySelectorAll('.meal-card input[type=checkbox]:checked').forEach(cb => {
      const card = cb.closest('.meal-card');
      const timeInput = card.querySelector('.meal-time-input');
      selectedMeals.push({ mealId: Number(cb.dataset.id), time: timeInput.value });
    });

    const intakeData = {
      meals: selectedMeals,
      totalCalories: +document.getElementById('total-calories').textContent,
      totalProtein: +document.getElementById('total-protein').textContent,
      totalCarbs: +document.getElementById('total-carbs').textContent,
      totalFats: +document.getElementById('total-fats').textContent,
      totalSodium: +document.getElementById('total-sodium').textContent,
      date: new Date().toLocaleDateString('en-CA')
    };

    try {
      const res = await fetch(`${API_URL}/save-intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(intakeData)
      });

      if (!res.ok) throw new Error('Failed to save intake');

      alert("Today's intake saved successfully!");
      await renderMeals();
    } catch (err) {
      console.error(err);
      alert('Error saving intake. Try again later.');
    } finally {
      saveBtn.disabled = false;
    }
  });

  renderMeals();
});
