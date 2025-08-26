

  //Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userId");

    // Redirect to login page
    window.location.href = "login.html";
  });
