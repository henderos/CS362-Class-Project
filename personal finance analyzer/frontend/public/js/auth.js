document.addEventListener("DOMContentLoaded", () => {
    const restrictedPages = ["dashboard.html", "plaid.html", "subscriptions.html", "spending-reports.html", "budgeting.html"];

    // Get current page name
    const currentPage = window.location.pathname.split("/").pop();

    // Allow access to login and signup pages without authentication
    if (currentPage === "login.html" || currentPage === "signup.html") {
        return;
    }

    // Check if the user is logged in
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!authToken || !userId) {
        alert("You must log in first!");
        window.location.href = "login.html";
    }
});
