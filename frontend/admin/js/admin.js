document.addEventListener("DOMContentLoaded", () => {
  const totalUsersEl = document.getElementById("totalUsers");
  const totalRemindersEl = document.getElementById("totalReminders");
  const completedRemindersEl = document.getElementById("completedReminders");
  const dynamicContent = document.getElementById("dynamicContent");

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  // -------------------- Dashboard Summary --------------------
  async function fetchReports() {
    try {
      const res = await fetch("/api/admin/reports", { headers });
      const data = await res.json();
      totalUsersEl.textContent = data.usersCount || 0;
      totalRemindersEl.textContent = data.totalReminders || 0;
      completedRemindersEl.textContent = data.completedReminders || 0;
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }

  // -------------------- Users Table --------------------
  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users", { headers });
      const users = await res.json();
      dynamicContent.innerHTML = `
        <h2>Users</h2>
        <table border="1" cellpadding="5">
          <tr><th>Name</th><th>Email</th><th>Trimester</th><th>Actions</th></tr>
          ${users.map(u => `
            <tr>
              <td>${u.fullName}</td>
              <td>${u.email}</td>
              <td>${u.trimester || '-'}</td>
              <td>
                <button onclick="deleteUser('${u._id}')">Delete</button>
              </td>
            </tr>`).join("")}
        </table>
      `;
    } catch (err) {
      console.error("Error loading users:", err);
    }
  }

  // -------------------- Delete User --------------------
  window.deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers });
      loadUsers();
      fetchReports();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // -------------------- Reminders Table --------------------
  async function loadReminders() {
    try {
      const res = await fetch("/api/admin/reminders", { headers });
      const reminders = await res.json();
      dynamicContent.innerHTML = `
        <h2>Reminders</h2>
        <table border="1" cellpadding="5">
          <tr><th>Title</th><th>User</th><th>DateTime</th><th>Status</th></tr>
          ${reminders.map(r => `
            <tr>
              <td>${r.title}</td>
              <td>${r.userEmail || '-'}</td>
              <td>${new Date(r.datetime).toLocaleString()}</td>
              <td>${r.completed ? "Completed" : "Pending"}</td>
            </tr>`).join("")}
        </table>
      `;
    } catch (err) {
      console.error("Error loading reminders:", err);
    }
  }

  // -------------------- Supplements Table --------------------
  async function loadSupplements() {
    try {
      const res = await fetch("/api/admin/supplements", { headers });
      const supplements = await res.json();
      dynamicContent.innerHTML = `
        <h2>Supplements</h2>
        <table border="1" cellpadding="5">
          <tr><th>Name</th><th>Trimester</th><th>Notes</th><th>Actions</th></tr>
          ${supplements.map(s => `
            <tr>
              <td>${s.name}</td>
              <td>${s.trimester}</td>
              <td>${s.notes || '-'}</td>
              <td>
                <button onclick="deleteSupplement('${s._id}')">Delete</button>
              </td>
            </tr>`).join("")}
        </table>
      `;
    } catch (err) {
      console.error("Error loading supplements:", err);
    }
  }

  // -------------------- Delete Supplement --------------------
  window.deleteSupplement = async (id) => {
    if (!confirm("Delete this supplement?")) return;
    try {
      await fetch(`/api/admin/supplements/${id}`, { method: "DELETE", headers });
      loadSupplements();
    } catch (err) {
      console.error("Error deleting supplement:", err);
    }
  };

  // -------------------- Sidebar Links --------------------
  document.getElementById("dashboardLink").addEventListener("click", fetchReports);
  document.getElementById("usersLink").addEventListener("click", loadUsers);
  document.getElementById("remindersLink").addEventListener("click", loadReminders);
  document.getElementById("supplementsLink").addEventListener("click", loadSupplements);

  // -------------------- Logout --------------------
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  });

  // -------------------- Initial Load --------------------
  fetchReports();
});
