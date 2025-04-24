
let votes = {};

// Load votes from Supabase
async function loadVotes() {
  const { data, error } = await supabase.from("votes").select();
  if (data) {
    data.forEach(row => {
      votes[row.option_name] = row.count;
    });
    updateResults();
  }
}

// Show screens
function showSignup() {
  document.getElementById("signup-screen").style.display = "block";
  document.getElementById("login-screen").style.display = "none";
}
function showLogin() {
  document.getElementById("signup-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "block";
}

// Signup logic
async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  const { data, error } = await supabase.from("users").insert([{ username, password, has_voted: false }]);
  if (error) {
    alert("Signup failed: " + error.message);
  } else {
    alert("Signup successful! Please login.");
    showLogin();
  }
}

// Login logic
async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (!data || error) {
    alert("Invalid username or password.");
    return;
  }

  if (data.has_voted) {
    alert("You have already voted.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(data));
  document.getElementById("userDisplay").textContent = username;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("voting-screen").style.display = "block";
  // updateResults();
  await loadVotes();
}

// Voting logic
async function vote(option) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.has_voted) {
    alert("You are not allowed to vote again.");
    return;
  }

  // Get current count
  const { data: voteData, error: voteError } = await supabase
    .from("votes")
    .select("*")
    .eq("option_name", option)
    .single();

  if (!voteData) {
    alert("Invalid option.");
    return;
  }

  // Increment vote count
  await supabase
    .from("votes")
    .update({ count: voteData.count + 1 })
    .eq("id", voteData.id);

  // Mark user as voted
  await supabase
    .from("users")
    .update({ has_voted: true })
    .eq("id", user.id);

  alert("Vote recorded!");
  loadVotes(); // refresh results
}

// Update Results
function updateResults() {
  for (let option in votes) {
    document.getElementById(`result-${option}`).textContent = votes[option];
  }
}

// Load votes on startup
loadVotes();

