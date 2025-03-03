/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");
const { screen, fireEvent } = require("@testing-library/dom");

// ---------------- MOCK localStorage & fetch & alert ----------------
beforeAll(() => {
  // Mock localStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "authToken") return "fake-token";
    if (key === "userId") return "2";
    return null;
  });
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();

  // Mock fetch
  global.fetch = jest.fn();

  // Mock window.alert
  global.alert = jest.fn();
});

// ---------------- REPLICATE THE FUNCTIONS (from budgeting.html) ------------------
async function loadBudgets() {
  const token = localStorage.getItem("authToken");
  const userID = localStorage.getItem("userId");

  if (!token || !userID) {
    console.error("❌ User is not logged in or missing userId.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/budgets/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load budgets");

    const budgets = await response.json();

    const tbody = document.getElementById("budgetsTable").querySelector("tbody");
    tbody.innerHTML = "";

    budgets.forEach((b) => {
      const row = document.createElement("tr");
      // Inline onclick calls deleteBudget() from global scope
      row.innerHTML = `
        <td>${b.category}</td>
        <td>$${b.budget_amount}</td>
        <td><button onclick="deleteBudget('${b.category}')">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Error loading budgets:", err);
    alert("Error loading budgets.");
  }
}

async function deleteBudget(category) {
  const token = localStorage.getItem("authToken");
  const userID = localStorage.getItem("userId");

  if (!token || !userID) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/budgets/${userID}/${category}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to delete budget");

    alert("Budget deleted successfully!");
    await loadBudgets();
  } catch (err) {
    console.error("❌ Error deleting budget:", err);
    alert("Error deleting budget");
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const token = localStorage.getItem("authToken");
  const userID = localStorage.getItem("userId");

  if (!token || !userID) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  const category = document.getElementById("category").value;
  const budget_amount = document.getElementById("amount").value;

  try {
    const response = await fetch("http://localhost:5000/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userID, category, budget_amount }),
    });

    if (!response.ok) throw new Error("Failed to set budget");

    alert("Budget set successfully!");
    document.getElementById("budgetForm").reset();
    await loadBudgets();
  } catch (err) {
    console.error("❌ Error setting budget:", err);
    alert("Error setting budget: " + err.message);
  }
}

// ---------------- TESTS ----------------
describe("Budgeting Page Tests", () => {
  beforeEach(() => {
    // Set up a minimal DOM from `budgeting.html`
    document.body.innerHTML = `
      <div class="main-content">
        <h1>Budgeting Tool</h1>
        <div class="budget-form">
          <h3>Set a New Budget</h3>
          <form id="budgetForm">
            <label for="category">Spending Category</label>
            <input type="text" id="category" required />

            <label for="amount">Budget Amount</label>
            <input type="number" id="amount" required />

            <button type="submit">Add/Update Budget</button>
          </form>
        </div>

        <h3>Existing Budgets</h3>
        <table class="budgets-table" id="budgetsTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    `;

    // Make these functions available to inline onclick attributes
    // so that `deleteBudget('Groceries')` is recognized:
    window.deleteBudget = deleteBudget;
    window.loadBudgets = loadBudgets;

    // Attach our form event listener
    const budgetForm = document.getElementById("budgetForm");
    budgetForm.addEventListener("submit", handleSubmit);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads budgets on loadBudgets() call", async () => {
    // Mock fetch to return some budgets
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { category: "Groceries", budget_amount: 150 },
        { category: "Entertainment", budget_amount: 75 },
      ],
    });

    await loadBudgets();

    // Check the table
    const rows = document.querySelectorAll("#budgetsTable tbody tr");
    expect(rows.length).toBe(2);

    expect(rows[0]).toHaveTextContent("Groceries");
    expect(rows[0]).toHaveTextContent("$150");

    expect(rows[1]).toHaveTextContent("Entertainment");
    expect(rows[1]).toHaveTextContent("$75");
  });

  test("submitting the budget form calls fetch with correct data", async () => {
    // Mock fetch for the POST request
    fetch.mockResolvedValueOnce({ ok: true });
    // Then mock fetch for loadBudgets
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ category: "Rent", budget_amount: 500 }],
    });

    // Fill the form
    document.getElementById("category").value = "Rent";
    document.getElementById("amount").value = "500";

    // Submit the form
    const form = document.getElementById("budgetForm");
    form.dispatchEvent(new Event("submit"));

    // Wait for handleSubmit to finish
    await new Promise((r) => setTimeout(r, 0));

    // Check fetch calls
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/budgets",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        }),
        body: JSON.stringify({
          user_id: "2",
          category: "Rent",
          budget_amount: "500",
        }),
      })
    );

    // After success, loadBudgets() is called
    // which calls fetch again to GET budgets
    const rows = document.querySelectorAll("#budgetsTable tbody tr");
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveTextContent("Rent");
    expect(rows[0]).toHaveTextContent("$500");
  });

  test("deleteBudget() calls the correct endpoint and refreshes the table", async () => {
    // 1. First load budgets
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ category: "Groceries", budget_amount: 100 }],
    });

    await loadBudgets();

    // 2. Mock fetch for DELETE
    fetch.mockResolvedValueOnce({ ok: true });
    // 3. Then mock fetch again for loadBudgets() after delete
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    // 4. Find the newly created row & its Delete button
    const rows = document.querySelectorAll("#budgetsTable tbody tr");
    expect(rows.length).toBe(1);

    const deleteBtn = rows[0].querySelector("button");
    expect(deleteBtn).toHaveTextContent("Delete");

    // 5. Click the Delete button
    deleteBtn.click();

    // 6. Wait a tick for async calls
    await new Promise((r) => setTimeout(r, 0));

    // 7. Check the DELETE request
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/budgets/2/Groceries",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );

    // 8. After successful delete, loadBudgets() is called again
    const newRows = document.querySelectorAll("#budgetsTable tbody tr");
    expect(newRows.length).toBe(0);
  });
});
