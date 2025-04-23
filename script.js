let votes = {
    "Option A": 0,
    "Option B": 0,
    "Option C": 0
  };
  
  // Load votes
  if (localStorage.getItem("votes")) {
    votes = JSON.parse(localStorage.getItem("votes"));
    updateResults();
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
  function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();
  
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users") || "{}");
  
    if (users[username]) {
      alert("Username already exists. Please choose another.");
      return;
    }
  
    users[username] = { password, hasVoted: false };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    showLogin();
  }
  
  // Login logic
  function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
  
    let users = JSON.parse(localStorage.getItem("users") || "{}");
  
    if (!users[username] || users[username].password !== password) {
      alert("Invalid username or password.");
      return;
    }
  
    if (users[username].hasVoted) {
      alert("You have already voted.");
      return;
    }
  
    localStorage.setItem("currentUser", username);
    document.getElementById("userDisplay").textContent = username;
  
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("voting-screen").style.display = "block";
    updateResults();
  }
  
  // Voting logic
  function vote(option) {
    const username = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users"));
  
    if (!username || users[username].hasVoted) {
      alert("You are not allowed to vote again.");
      return;
    }
  
    votes[option]++;
    users[username].hasVoted = true;
  
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("users", JSON.stringify(users));
    alert("Vote recorded!");
}