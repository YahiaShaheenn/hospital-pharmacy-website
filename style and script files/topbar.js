let topbar = document.createElement("div");

topbar.innerHTML = `
    <div class="toprow">
        <h1>Pharmacy</h1>
        <div class="profile">
            <a href="LogIn.html" class="profile-icon">
                <span class="material-icons">account_circle</span>
            </a>
        </div>
    </div>

    <div class="nav">
        <button type="button" onclick="location.href='dashboard.html'">Home</button>
        <button type="button" onclick="location.href='inventory.html'">Inventory</button>
        <button type="button" onclick="location.href='sales.html'">Sales</button>
        <button type="button" onclick="location.href='reports.html'">Reports</button>
    </div>
`;

topbar.className = "TopBar";

document.body.insertBefore(topbar, document.body.firstChild);