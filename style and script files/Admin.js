
    sessionStorage.setItem("admin", true); // Mark that admin is logged in
    sessionStorage.setItem("currentDoctor", "Admin"); // Set current doctor to Admin for personalized messages
    setButtonVisibility(); // Update button visibility


// Load and display doctors list
function loadDoctorsList() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || []; // Get doctors list from localStorage, or use empty array if not found
    const doctorsList = document.getElementById("doctorsList"); 

    doctorsList.innerHTML = ""; // Clear the list

    if (doctors.length === 0) {
        document.getElementById("noDoctorsMessage").textContent = "No doctors added yet";
    }

    for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];

        const doctorItem = document.createElement("div");
        doctorItem.className = "doctor-item";

        doctorItem.innerHTML = `
        <div class="doctor-info">
            <p class="username">Username: ${doctor.username}</p> <!-- the dollar sign is used to insert the value of doctor.username into the string -->
            
        </div>
        <div class="doctor-actions">
            <button class="action-btn edit-btn" onclick="editDoctor(${i})" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
            <button class="action-btn delete-btn" onclick="deleteDoctor(${i})" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
        </div>
    `;

        doctorsList.appendChild(doctorItem); 
    }
}

// Edit doctor by index
let currentEditIndex = null;
function editDoctor(index) {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || []; // turns the JSON string back into a JavaScript array, or uses an empty array if no doctors are found

    const doctor = doctors[index];

    currentEditIndex = index;

    document.getElementById("editUsername").value = doctor.username;

    document.getElementById("editPassword").value = doctor.password;

    document.getElementById("editPopup").style.display = "flex";
}

// Save edited doctor details
function saveEditedDoctor() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    doctors[currentEditIndex] = {
        username: document.getElementById("editUsername").value,
        password: document.getElementById("editPassword").value
    };

    localStorage.setItem("doctors", JSON.stringify(doctors));
    document.getElementById("editPopup").style.display = "none";
    loadDoctorsList();
}

//Save when save button is clicked
document.getElementById("saveEditBtn").addEventListener("click", saveEditedDoctor);

// Move focus to password field when Enter is pressed in username field
document.getElementById("editUsername").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("editPassword").focus(); // Move focus to password field    
    }
});

// Save when Enter is pressed in password field
document.getElementById("editPassword").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        saveEditedDoctor();
    }
});



// Close popup without saving (cancel)
document.getElementById("closePopupBtn").addEventListener("click", function () {
    document.getElementById("editPopup").style.display = "none";
});



// Delete doctor by index
function deleteDoctor(index) {

    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    doctors.splice(index, 1); // Remove 1 doctor at the specified index and doesnt leave empty space

    localStorage.setItem("doctors", JSON.stringify(doctors));

    loadDoctorsList();
}

// Load doctors list when page loads
document.addEventListener("DOMContentLoaded", loadDoctorsList); //DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. This means that the loadDoctorsList function will be called as soon as the HTML is ready, ensuring that the doctors list is displayed immediately when the page loads.

function addDoctor() {
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
    setTimeout(() => document.getElementById("message").textContent = "", 3000); // Clear message after 3 seconds

    loadDoctorsList(); // Refresh the list
    if (doctors.length > 0) {
        document.getElementById("noDoctorsMessage").textContent = ""; // Clear "No doctors" message if there are now doctors in the list
    }
};

document.getElementById("AddDoctorUsername").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("AddDoctorPassword").focus(); // Move focus to password field    
    }
});

document.getElementById("AddDoctorPassword").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        addDoctor();
    }
});

document.getElementById("AddDoctorForm").addEventListener("submit", function (e) {
    e.preventDefault();
    addDoctor();
});

