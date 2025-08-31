const loginForm = document.getElementById("login-form"); // match HTML ID

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("res.ok:", res.ok);
    console.log("Response data:", data);

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "home.html"; // redirect after login
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
});
