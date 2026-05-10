
// Load and display doctors list
function loadDoctorsList() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const doctorsList = document.getElementById("doctorsList");
    
    doctorsList.innerHTML = ""; // Clear the list
    
    if (doctors.length === 0) {
        doctorsList.innerHTML = "<p style='text-align:center; color:#999;'>No doctors added yet</p>";
        return;
    }
    
    doctors.forEach((doctor, index) => {
        const doctorItem = document.createElement("div");
        doctorItem.className = "doctor-item";
        doctorItem.innerHTML = `
            <div class="doctor-info">
                <p class="username">Username: ${doctor.username}</p>
            </div>
            <div class="doctor-actions">
                <button class="action-btn edit-btn" onclick="editDoctor(${index})" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteDoctor(${index})" title="Delete">🗑️</button>
            </div>
        `;
        doctorsList.appendChild(doctorItem);
    });
}

// Edit doctor (opens prompt to change username/password)
function editDoctor(index) {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const doctor = doctors[index];
    
    const newUsername = prompt("Enter new username:", doctor.username);
    if (newUsername === null) return; // User cancelled
    
    const newPassword = prompt("Enter new password:", doctor.password);
    if (newPassword === null) return; // User cancelled
    
    doctors[index] = { username: newUsername, password: newPassword };
    localStorage.setItem("doctors", JSON.stringify(doctors));
    loadDoctorsList();
}

// Delete doctor by index
function deleteDoctor(index) {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    
    if (confirm(`Delete doctor "${doctors[index].username}"?`)) {
        doctors.splice(index, 1);
        localStorage.setItem("doctors", JSON.stringify(doctors));
        loadDoctorsList();
    }
}

// Load doctors list when page loads
document.addEventListener("DOMContentLoaded", loadDoctorsList);

// Update list after adding a doctor
document.getElementById("AddDoctorForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const doctorUsername = document.getElementById("AddDoctorUsername").value;
    const doctorPassword = document.getElementById("AddDoctorPassword").value;
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    doctors.push({
        username: doctorUsername,
        password: doctorPassword
    });
    
    localStorage.setItem("doctors", JSON.stringify(doctors));
    
    // Clear form and show success
    document.getElementById("AddDoctorForm").reset();
    document.getElementById("message").textContent = "Doctor added successfully!";
    setTimeout(() => document.getElementById("message").textContent = "", 3000);
    
    loadDoctorsList(); // Refresh the list
});
