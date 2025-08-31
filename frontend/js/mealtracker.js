
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
    { id: 1, name: 'Beyeaynet', type: 'Breakfast', image: '../imgs/beyaynet.jpg', time: '08:00', calories: 150, protein: 5, carbs: 27, fats: 3, sodium: 50 },
    { id: 2, name: 'Egg Sandwich', type: 'Breakfast', image: '../imgs/avocado juice.jpg', time: '08:30', calories: 220, protein: 12, carbs: 25, fats: 8, sodium: 300 },
    { id: 3, name: 'Asa(fish)', type: 'Breakfast', image: '../imgs/fish.jpg', time: '12:30', calories: 250, protein: 30, carbs: 10, fats: 12, sodium: 400 },
    { id: 4, name: 'Bula', type: 'Breakfast', image: '../imgs/bula.jpg', time: '19:00', calories: 300, protein: 35, carbs: 0, fats: 20, sodium: 120 },
    { id: 5, name: 'Yetef Chechebsa', type: 'Breakfast', image:'../imgs/chechebsa.jpg', time: '15:30', calories: 100, protein: 4, carbs: 6, fats: 9, sodium: 0 },
    { id: 6, name: 'Chuko', type: 'Breakfast', image:'../imgs/chuko.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 7, name: 'Egg', type: 'Breakfast', image:'../imgs/egg.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 8, name: 'Enjera Firfir', type: 'Breakfast', image:'../imgs/Enjera firfir.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 9, name: 'Genfo(porrage)', type: 'Breakfast', image:'../imgs/genfo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 10, name: 'Hilbet', type: 'Breakfast', image:'../imgs/hilbet.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 11, name: 'Tihlo', type: 'Breakfast', image:'../imgs/Tihlo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 12, name: 'Papaya Juice', type: 'Breakfast', image:'../imgs/papaya juice.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 13, name: 'Shiro', type: 'Breakfast', image:'../imgs/shiro.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 14, name: 'Chechebsa', type: 'Breakfast', image:'../imgs/yesinde chechebsa.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 15, name: 'Yetekekele boklo', type: 'Breakfast', image:'../imgs/yetekekele bekolo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },


    { id: 16, name: 'Beyeaynet', type: 'Lunch', image: '../imgs/beyaynet.jpg', time: '08:00', calories: 150, protein: 5, carbs: 27, fats: 3, sodium: 50 },
    { id: 17, name: 'Egg Sandwich', type: 'Lunch', image: '../imgs/avocado juice.jpg', time: '08:30', calories: 220, protein: 12, carbs: 25, fats: 8, sodium: 300 },
    { id: 18, name: 'Asa(fish)', type: 'Lunch', image: '../imgs/fish.jpg', time: '12:30', calories: 250, protein: 30, carbs: 10, fats: 12, sodium: 400 },
    { id: 19, name: 'Bula', type: 'Lunch', image: '../imgs/bula.jpg', time: '19:00', calories: 300, protein: 35, carbs: 0, fats: 20, sodium: 120 },
    { id: 20, name: 'Yetef Chechebsa', type: 'Lunch', image:'../imgs/chechebsa.jpg', time: '15:30', calories: 100, protein: 4, carbs: 6, fats: 9, sodium: 0 },
    { id: 21, name: 'Chuko', type: 'Lunch', image:'../imgs/chuko.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 22, name: 'Egg', type: 'Lunch', image:'../imgs/egg.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 23, name: 'Enjera Firfir', type: 'Lunch', image:'../imgs/Enjera firfir.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 24, name: 'Genfo(porrage)', type: 'Lunch', image:'../imgs/genfo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 25, name: 'Hilbet', type: 'Lunch', image:'../imgs/hilbet.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 26, name: 'Tihlo', type: 'Lunch', image:'../imgs/Tihlo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 27, name: 'Papaya Juice', type: 'Lunch', image:'../imgs/papaya juice.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 28, name: 'Shiro', type: 'Lunch', image:'../imgs/shiro.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 29, name: 'Chechebsa', type: 'Lunch', image:'../imgs/yesinde chechebsa.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 30, name: 'Yetekekele boklo', type: 'Lunch', image:'../imgs/yetekekele bekolo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
  
  
      { id: 31, name: 'Beyeaynet', type: 'Snack', image: '../imgs/beyaynet.jpg', time: '08:00', calories: 150, protein: 5, carbs: 27, fats: 3, sodium: 50 },
    { id: 32, name: 'Egg Sandwich', type: 'Snack', image: '../imgs/avocado juice.jpg', time: '08:30', calories: 220, protein: 12, carbs: 25, fats: 8, sodium: 300 },
    { id: 33, name: 'Asa(fish)', type: 'Snack', image: '../imgs/fish.jpg', time: '12:30', calories: 250, protein: 30, carbs: 10, fats: 12, sodium: 400 },
    { id: 34, name: 'Bula', type: 'Snack', image: '../imgs/bula.jpg', time: '19:00', calories: 300, protein: 35, carbs: 0, fats: 20, sodium: 120 },
    { id: 35, name: 'Yetef Chechebsa', type: 'Snack', image:'../imgs/chechebsa.jpg', time: '15:30', calories: 100, protein: 4, carbs: 6, fats: 9, sodium: 0 },
    { id: 36, name: 'Chuko', type: 'Snack', image:'../imgs/chuko.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 37, name: 'Egg', type: 'Snack', image:'../imgs/egg.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 38, name: 'Enjera Firfir', type: 'Snack', image:'../imgs/Enjera firfir.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 39, name: 'Genfo(porrage)', type: 'Snack', image:'../imgs/genfo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 40, name: 'Hilbet', type: 'Snack', image:'../imgs/hilbet.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 41, name: 'Tihlo', type: 'Snack', image:'../imgs/Tihlo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 42, name: 'Papaya Juice', type: 'Snack', image:'../imgs/papaya juice.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 43, name: 'Shiro', type: 'Snack', image:'../imgs/shiro.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 44, name: 'Chechebsa', type: 'Snack', image:'../imgs/yesinde chechebsa.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 45, name: 'Yetekekele boklo', type: 'Snack', image:'../imgs/yetekekele bekolo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },

        { id: 46, name: 'Beyeaynet', type: 'Dinner', image: '../imgs/beyaynet.jpg', time: '08:00', calories: 150, protein: 5, carbs: 27, fats: 3, sodium: 50 },
    { id: 47, name: 'Egg Sandwich', type: 'Dinner', image: '../imgs/avocado juice.jpg', time: '08:30', calories: 220, protein: 12, carbs: 25, fats: 8, sodium: 300 },
    { id: 48, name: 'Asa(fish)', type: 'Dinner', image: '../imgs/fish.jpg', time: '12:30', calories: 250, protein: 30, carbs: 10, fats: 12, sodium: 400 },
    { id: 49, name: 'Bula', type: 'Dinner', image: '../imgs/bula.jpg', time: '19:00', calories: 300, protein: 35, carbs: 0, fats: 20, sodium: 120 },
    { id: 50, name: 'Yetef Chechebsa', type: 'Dinner', image:'../imgs/chechebsa.jpg', time: '15:30', calories: 100, protein: 4, carbs: 6, fats: 9, sodium: 0 },
    { id: 51, name: 'Chuko', type: 'Dinner', image:'../imgs/chuko.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 52, name: 'Egg', type: 'Dinner', image:'../imgs/egg.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 53, name: 'Enjera Firfir', type: 'Dinner', image:'../imgs/Enjera firfir.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 54, name: 'Genfo(porrage)', type: 'Dinner', image:'../imgs/genfo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 55, name: 'Hilbet', type: 'Dinner', image:'../imgs/hilbet.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 56, name: 'Tihlo', type: 'Dinner', image:'../imgs/Tihlo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 57, name: 'Papaya Juice', type: 'Dinner', image:'../imgs/papaya juice.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 58, name: 'Shiro', type: 'Dinner', image:'../imgs/shiro.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 59, name: 'Chechebsa', type: 'Dinner', image:'../imgs/yesinde chechebsa.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 },
    { id: 60, name: 'Yetekekele boklo', type: 'Dinner', image:'../imgs/yetekekele bekolo.jpg', time: '16:00', calories: 120, protein: 6, carbs: 18, fats: 3, sodium: 40 }
  
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
