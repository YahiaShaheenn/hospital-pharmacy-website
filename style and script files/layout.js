let style = document.createElement("style");

style.textContent = `

.TopBar{
    background-color: rgb(63, 138, 153);
    color: black;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 6px;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.toprow{
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
}

.toprow h1{
    justify-self: center;
    grid-column: 2;
    font-size: 45px;
}

.profile{
    justify-self: end;
    grid-column: 3;
    margin-top: 10px;
}

.nav{
    display: flex;
    gap: 70px;
    justify-content: center;
}

.nav button{
    background-color: powderblue;
    color: black;
    padding: 5px;
    border-radius: 8px;
    margin-top: 10px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); // first number is horizontal offset, second is vertical offset, third is blur radius, and fourth is color
    border: none;
}

.nav button:hover{
    background-color: lightgoldenrodyellow;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
}

body{
    margin: 0;
    padding: 0;
    background-color: powderblue;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

body::before{
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../style and script files/saidaleya.png');
    background-repeat: no-repeat;
    background-position: center 120px;
    background-size: 700px;
    opacity: 0.2;
    z-index: -1;
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'ADLaM Display', sans-serif;
}

.profile-icon{
    color: black;
    text-decoration: none;
}

.profile-icon:visited{
    color: black;
}

.profile-icon .material-icons{
    font-size: 40px;
}

.profile-icon:hover .material-icons{
    transform: translateY(-2px);
}
.footer {
    background-color: rgb(63, 138, 153);
    color: white;
    text-align: center;
    padding: 15px;
    margin-top: auto;
    width: 100%;
}

.footer p {
    margin: 5px 0;
    font-size: 14px;
}
    @media (max-width: 768px) {
    .toprow h1 {
        font-size: 28px;
    }

    .nav {
        gap: 15px;
    }

    .nav button {
        padding: 4px 8px;
        font-size: 12px;
    }

    .summary {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 480px) {
    .summary {
        grid-template-columns: 1fr;
    }

    .nav {
        gap: 8px;
    }

    .toprow h1 {
        font-size: 22px;
    }
}
`;

document.head.appendChild(style);



let topbar = document.createElement("div");
topbar.className = "TopBar";

topbar.innerHTML = `
    <div class="toprow">

        <h1>Al-Shifaa</h1>

        <div class="profile">
            <a href="login.html" class="profile-icon"  id="logout" title="Logout">
                <span class="material-icons">logout</span>
            </a>

            <a href="LogIn.html" class="profile-icon" title="Profile" id="profileLink">
                <span class="material-icons">account_circle</span>
            </a>
        </div>

    </div>

    <div class="nav">
        <button type="button" onclick="location.href='dashboard.html'">Dashboard</button>
        <button type="button" onclick="location.href='inventory.html'">Inventory</button>
        <button type="button" onclick="location.href='sales.html'">Sales</button>
        <button type="button" onclick="location.href='reports.html'">Reports</button>
        <button id="manageDoctorsBtn" type="button" onclick="location.href='admin.html'">Manage Doctors</button>
    </div>
`;

document.body.insertBefore(topbar, document.body.firstChild);

// Function to set button visibility based on admin status
function setButtonVisibility() {
    isAdmin = sessionStorage.getItem("admin") === "true";
    if (isAdmin) {
        document.getElementById("logout").style.display = "none";
        document.getElementById("profileLink").style.display = "block";
        document.getElementById("manageDoctorsBtn").style.display = "block";
    }
    else {
        document.getElementById("logout").style.display = "block";
        document.getElementById("profileLink").style.display = "none";
        document.getElementById("manageDoctorsBtn").style.display = "none";
    }
}

// Set initial visibility
setButtonVisibility();

window.addEventListener('load', function () {
    let footer = document.createElement("div");
    footer.className = "footer";
    footer.innerHTML = `
        <p> Pharmacy</p>
        <p>© ${new Date().getFullYear()} All Rights Reserved</p>
    `;
    document.body.appendChild(footer);
});
