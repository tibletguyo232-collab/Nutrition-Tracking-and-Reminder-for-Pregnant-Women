document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
const res = await fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || 'Login failed');
      return;
    }
    
    localStorage.setItem('token', data.token);

    alert('Login successful!');
    window.location.href = 'home.html';

  } catch (err) {
    console.error(err);
    alert('Server error. Please try again later.');
  }
});
