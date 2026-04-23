const state = {
  user: null,
  habits: [],
  completedHabitIds: [],
  storeItems: []
};

function setStatus(message = "", type = "info") {
  const statusNode = document.getElementById("statusMessage");
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.toggle("error", type === "error");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

function findStoreItem(itemId) {
  return state.storeItems.find((item) => item.id === itemId);
}

function renderProfile() {
  const profileCard = document.getElementById("profileCard");
  const coinPanel = document.getElementById("coinPanel");
  const user = state.user;

  if (!user) {
    profileCard.innerHTML = "<p>Loading profile...</p>";
    coinPanel.innerHTML = "<p>Loading coins...</p>";
    return;
  }

  coinPanel.innerHTML = `
    <p class="eyebrow">Coins</p>
    <h2 class="coin-count">${user.coins}</h2>
    <p class="coin-copy">Spend coins on avatar and base upgrades.</p>
  `;

  profileCard.innerHTML = `
    <div>
      <p class="eyebrow">Player</p>
      <h2>${user.displayName}</h2>
      <p class="muted">Demo user flow for the MVP. Add auth later if you want multi-user support.</p>
    </div>
    <div class="stat-grid">
      <span class="chip">Level ${user.level}</span>
      <span class="chip">${user.xp} XP</span>
      <span class="chip">${state.habits.length} habits</span>
    </div>
    <div class="message">Complete habits today to earn upgrades.</div>
  `;
}

function rerender() {
  renderProfile();
  renderHabits();
  renderShowcase();
  renderStore();
}

function renderHabits() {
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  if (!state.habits.length) {
    habitList.innerHTML = `<div class="habit-card"><p class="muted">No habits yet. Add your first routine above.</p></div>`;
    return;
  }

  const template = document.getElementById("habitTemplate");

  for (const habit of state.habits) {
    const node = template.content.cloneNode(true);
    node.querySelector(".habit-title").textContent = habit.title;
    node.querySelector(".habit-description").textContent = habit.description || "No description";
    node.querySelector(".habit-meta").innerHTML = `
      <span class="chip">${habit.frequency}</span>
      <span class="chip">${habit.streak} day streak</span>
      <span class="chip">${habit.rewardCoins} coins</span>
      <span class="chip">${habit.rewardXp} XP</span>
    `;

    const completed = state.completedHabitIds.includes(habit._id);
    const actions = node.querySelector(".habit-actions");

    const completeButton = document.createElement("button");
    completeButton.textContent = completed ? "Completed today" : "Complete";
    completeButton.disabled = completed;
    completeButton.addEventListener("click", async () => {
      try {
        const payload = await api(`/api/habits/${habit._id}/complete`, { method: "POST" });
        state.user = payload.user;
        state.habits = state.habits.map((entry) => (entry._id === payload.habit._id ? payload.habit : entry));
        state.completedHabitIds = [...state.completedHabitIds, habit._id];
        setStatus(`Completed "${habit.title}" and earned ${payload.rewards.coins} coins.`);
        rerender();
      } catch (error) {
        setStatus(error.message, "error");
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "secondary";
    deleteButton.addEventListener("click", async () => {
      try {
        await api(`/api/habits/${habit._id}`, { method: "DELETE" });
        state.habits = state.habits.filter((entry) => entry._id !== habit._id);
        state.completedHabitIds = state.completedHabitIds.filter((id) => id !== habit._id);
        setStatus(`Deleted "${habit.title}".`);
        rerender();
      } catch (error) {
        setStatus(error.message, "error");
      }
    });

    actions.append(completeButton, deleteButton);
    habitList.appendChild(node);
  }
}

function renderShowcase() {
  const showcase = document.getElementById("showcase");
  const avatarItem = findStoreItem(state.user?.equippedAvatarItemId);
  const baseItem = findStoreItem(state.user?.equippedBaseItemId);

  showcase.innerHTML = `
    <div class="base" style="background: ${baseItem?.style || "linear-gradient(160deg, #fffbeb, #ecfccb)"}"></div>
    <div class="avatar">
      ${avatarItem ? `<div class="avatar-item" style="background: ${avatarItem.style}"></div>` : ""}
    </div>
  `;
}

function renderStore() {
  const storeGrid = document.getElementById("storeGrid");
  storeGrid.innerHTML = "";
  const template = document.getElementById("storeItemTemplate");

  for (const item of state.storeItems) {
    const node = template.content.cloneNode(true);
    const owned = state.user.ownedItemIds.includes(item.id);
    const equipped =
      state.user.equippedAvatarItemId === item.id || state.user.equippedBaseItemId === item.id;

    node.querySelector(".store-preview").style.background = item.style;
    node.querySelector(".store-name").textContent = `${item.name} (${item.type})`;
    node.querySelector(".store-cost").textContent = `${item.cost} coins`;

    const button = node.querySelector(".store-action");
    if (!owned) {
      button.textContent = "Buy";
      button.disabled = state.user.coins < item.cost;
      button.addEventListener("click", async () => {
        try {
          const payload = await api("/api/store/purchase", {
            method: "POST",
            body: JSON.stringify({ itemId: item.id })
          });
          state.user = payload.user;
          setStatus(`Purchased "${item.name}".`);
          rerender();
        } catch (error) {
          setStatus(error.message, "error");
        }
      });
    } else if (!equipped) {
      button.textContent = "Equip";
      button.addEventListener("click", async () => {
        try {
          const payload = await api("/api/store/equip", {
            method: "POST",
            body: JSON.stringify({ itemId: item.id })
          });
          state.user = payload.user;
          setStatus(`Equipped "${item.name}".`);
          rerender();
        } catch (error) {
          setStatus(error.message, "error");
        }
      });
    } else {
      button.textContent = "Unequip"; 
      button.className = "secondary"; 
      button.addEventListener("click", async () => { 
        try { 
          const payload = await api("/api/store/unequip", { 
            method: "POST", 
            body: JSON.stringify({ itemType: item.type }) 
          }); 
          state.user = payload.user; 
          setStatus(`Unequipped "${item.name}".`); 
          rerender(); 
        } catch (error) { 
          setStatus(error.message, "error"); 
        } 
      }); 
    }

    storeGrid.appendChild(node);
  }
}

async function loadApp() {
  const payload = await api("/api/bootstrap");
  state.user = payload.user;
  state.habits = payload.habits;
  state.completedHabitIds = payload.completedHabitIds;
  state.storeItems = payload.storeItems;
  rerender();
}

document.getElementById("habitForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.rewardCoins = Number(payload.rewardCoins);
  payload.rewardXp = Number(payload.rewardXp);

  try {
    const habit = await api("/api/habits", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.habits = [habit, ...state.habits];
    form.reset();
    document.getElementById("rewardCoins").value = "10";
    document.getElementById("rewardXp").value = "5";
    setStatus(`Added "${habit.title}".`);
    rerender();
  } catch (error) {
    setStatus(error.message, "error");
  }
});

loadApp().catch((error) => {
  document.body.innerHTML = `<pre style="padding: 20px;">${error.message}</pre>`;
});

document.getElementById("resetProgressButton").addEventListener("click", async () => {
  const confirmed = window.confirm("Reset all habits, coins, XP, and equipped items?");

  if (!confirmed) {
    return;
  }

  try {
    const payload = await api("/api/profile/reset", { method: "POST" });
    state.user = payload.user;
    state.habits = payload.habits;
    state.completedHabitIds = payload.completedHabitIds;
    setStatus("Progress reset.");
    rerender();
  } catch (error) {
    setStatus(error.message, "error");
  }
});
