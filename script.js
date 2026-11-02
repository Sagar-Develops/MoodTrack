// MoodTrack JavaScript

const moodButtons = document.querySelectorAll(".moods button");

const todayMood = document.querySelector(".stats .card:nth-child(1) h2");
const totalCheckins = document.querySelector(".stats .card:nth-child(3) h2");

const startButton = document.querySelector(".primary-btn");

let moodEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];

const today = new Date().toLocaleDateString("en-CA");

const moodEmojis = {
    Sad: "😢",
    Low: "😟",
    Okay: "😐",
    Good: "🙂",
    Great: "😄"
};

// Update dashboard
function updateDashboard() {
    const todayEntry = moodEntries.find(entry => entry.date === today);

    if (todayEntry) {
        todayMood.textContent = todayEntry.emoji + " " + todayEntry.mood;
    } else {
        todayMood.textContent = "Not Set";
    }

    totalCheckins.textContent = moodEntries.length;
}

// Save selected mood
moodButtons.forEach(button => {

    button.addEventListener("click", function () {

        const mood = this.querySelector("span").textContent;
        const emoji = moodEmojis[mood];

        const existingEntry = moodEntries.find(entry => entry.date === today);

        if (existingEntry) {
            existingEntry.mood = mood;
            existingEntry.emoji = emoji;
        } else {
            moodEntries.push({
                date: today,
                mood: mood,
                emoji: emoji
            });
        }

        localStorage.setItem("moodEntries", JSON.stringify(moodEntries));

        moodButtons.forEach(btn => btn.classList.remove("selected"));

        this.classList.add("selected");

        updateDashboard();

        alert("Your mood has been saved successfully! 💚");
    });

});

// Start Check-in button
startButton.addEventListener("click", function () {
    document.querySelector(".moods").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// Load saved data
updateDashboard();
// Stress Tracking

const stressSlider = document.getElementById("stressSlider");
const stressValue = document.getElementById("stressValue");
const saveStressButton = document.getElementById("saveStress");

const stressCard = document.querySelector(".stats .card:nth-child(2) h2");

// Update slider value
stressSlider.addEventListener("input", function () {
    stressValue.textContent = this.value + " / 10";
});

// Save stress level
saveStressButton.addEventListener("click", function () {

    const level = Number(stressSlider.value);

    let stressLabel = "Low";

    if (level >= 4 && level <= 7) {
        stressLabel = "Moderate";
    } else if (level >= 8) {
        stressLabel = "High";
    }

    localStorage.setItem("todayStress", JSON.stringify({
        date: today,
        level: level,
        label: stressLabel
    }));
    let stressHistory = JSON.parse(
    localStorage.getItem("stressEntries")
) || [];

const oldEntry = stressHistory.findIndex(
    entry => entry.date === today
);

const newEntry = {
    date: today,
    level: level
};

if (oldEntry >= 0) {
    stressHistory[oldEntry] = newEntry;
} else {
    stressHistory.push(newEntry);
}

localStorage.setItem(
    "stressEntries",
    JSON.stringify(stressHistory)
);

    stressCard.textContent = stressLabel;

    alert("Your stress level has been saved! 💚");
});

// Load saved stress
const savedStress = JSON.parse(localStorage.getItem("todayStress"));

if (savedStress && savedStress.date === today) {
    stressSlider.value = savedStress.level;
    stressValue.textContent = savedStress.level + " / 10";
    stressCard.textContent = savedStress.label;
}
// Analytics Dashboard

const moodScores = {
    Sad: 1,
    Low: 2,
    Okay: 3,
    Good: 4,
    Great: 5
};

// Last 7 days
const last7Days = [];

for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toLocaleDateString("en-CA"));
}

// Mood chart data
const moodData = last7Days.map(date => {
    const entry = moodEntries.find(item => item.date === date);
    return entry ? moodScores[entry.mood] : null;
});

// Stress chart data
const stressEntries = JSON.parse(
    localStorage.getItem("stressEntries")
) || [];

const stressData = last7Days.map(date => {
    const entry = stressEntries.find(item => item.date === date);
    return entry ? entry.level : null;
});

// Mood Chart
new Chart(document.getElementById("moodChart"), {
    type: "line",
    data: {
        labels: last7Days,
        datasets: [{
            label: "Mood Score",
            data: moodData,
            borderWidth: 3,
            tension: 0.4,
            spanGaps: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

// Stress Chart
new Chart(document.getElementById("stressChart"), {
    type: "line",
    data: {
        labels: last7Days,
        datasets: [{
            label: "Stress Level",
            data: stressData,
            borderWidth: 3,
            tension: 0.4,
            spanGaps: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: 1,
                max: 10,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});
// My Personal Journal

const journalEntry = document.getElementById("journalEntry");
const saveJournalButton = document.getElementById("saveJournal");
const journalList = document.getElementById("journalList");

let journalEntries = JSON.parse(
    localStorage.getItem("journalEntries")
) || [];

// Display journal entries
function displayJournal() {

    journalList.innerHTML = "";

    if (journalEntries.length === 0) {
        journalList.innerHTML = "<p>No journal entries yet.</p>";
        return;
    }

    journalEntries.slice().reverse().forEach((entry) => {

        const card = document.createElement("div");
        card.className = "journal-entry";

        const date = document.createElement("h4");
        date.textContent = entry.date;

        const content = document.createElement("p");
        content.textContent = entry.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            journalEntries = journalEntries.filter(
                item => item.id !== entry.id
            );

            localStorage.setItem(
                "journalEntries",
                JSON.stringify(journalEntries)
            );

            displayJournal();
        });

        card.appendChild(date);
        card.appendChild(content);
        card.appendChild(deleteButton);

        journalList.appendChild(card);
    });
}

// Save journal
saveJournalButton.addEventListener("click", function () {

    const text = journalEntry.value.trim();

    if (text === "") {
        alert("Please write something first!");
        return;
    }

    journalEntries.push({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        text: text
    });

    localStorage.setItem(
        "journalEntries",
        JSON.stringify(journalEntries)
    );

    journalEntry.value = "";

    displayJournal();

    alert("Journal saved successfully! 💚");
});

// Load saved entries
displayJournal();
// Breathing Exercise

const breathingCircle = document.getElementById("breathingCircle");
const breathingText = document.getElementById("breathingText");
const breathingInstruction = document.getElementById("breathingInstruction");
const startBreathing = document.getElementById("startBreathing");

let breathingInterval;
let breathingTime = 0;
let isBreathing = false;

function stopBreathing() {
    clearInterval(breathingInterval);

    isBreathing = false;
    breathingCircle.classList.remove("inhale", "exhale");

    breathingText.textContent = "Completed!";
    breathingInstruction.textContent = "Well done! Take a moment to relax.";
    startBreathing.textContent = "Start Again";
}

startBreathing.addEventListener("click", function () {

    if (isBreathing) {
        clearInterval(breathingInterval);
        isBreathing = false;

        breathingCircle.classList.remove("inhale", "exhale");
        breathingText.textContent = "Paused";
        breathingInstruction.textContent = "Take a break whenever you need.";
        startBreathing.textContent = "Start Again";
        return;
    }

    isBreathing = true;
    breathingTime = 0;

    startBreathing.textContent = "Pause Exercise";

    function breathingStep() {

        if (breathingTime >= 60) {
            stopBreathing();
            return;
        }

        if (breathingTime % 8 < 4) {
            breathingText.textContent = "Breathe In";
            breathingInstruction.textContent = "Gently breathe in.";
            breathingCircle.classList.add("inhale");
            breathingCircle.classList.remove("exhale");
        } else {
            breathingText.textContent = "Breathe Out";
            breathingInstruction.textContent = "Slowly breathe out.";
            breathingCircle.classList.add("exhale");
            breathingCircle.classList.remove("inhale");
        }

        breathingTime++;
    }

    breathingStep();

    breathingInterval = setInterval(breathingStep, 1000);
});
// Dark and Light Mode

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
let savedTheme = localStorage.getItem("moodTrackTheme") || "dark";

function applyTheme() {

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "🌙 Dark Mode";
    } else {
        document.body.classList.remove("light-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }
}

themeToggle.addEventListener("click", function () {

    savedTheme = savedTheme === "dark" ? "light" : "dark";

    localStorage.setItem("moodTrackTheme", savedTheme);

    applyTheme();
});

applyTheme();
// User Profile

const userNameInput = document.getElementById("userName");
const saveProfileButton = document.getElementById("saveProfile");
const profileMessage = document.getElementById("profileMessage");
const profileCircle = document.querySelector(".profile");

let savedName = localStorage.getItem("moodTrackUserName") || "";

userNameInput.value = savedName;

if (savedName) {
    profileCircle.textContent = savedName.charAt(0).toUpperCase();
}

saveProfileButton.addEventListener("click", function () {

    const name = userNameInput.value.trim();

    if (name === "") {
        profileMessage.textContent = "Please enter your name.";
        return;
    }

    localStorage.setItem("moodTrackUserName", name);

    profileCircle.textContent = name.charAt(0).toUpperCase();

    profileMessage.textContent = "Profile saved successfully! 💚";
});

// Load saved profile
if (savedName) {
    profileMessage.textContent = "Welcome back, " + savedName + "!";
}
// Settings Theme Button

const settingsThemeButton = document.getElementById("settingsTheme");

if (settingsThemeButton) {
    settingsThemeButton.addEventListener("click", function() {
        themeToggle.click();
    });
}
// Developer Profile Initials
document.querySelector(".profile").textContent =
    document.getElementById("userName").value.trim().charAt(0).toUpperCase();
// Welcome Message
const welcomeTitle = document.getElementById("welcomeTitle");
const savedUserName = localStorage.getItem("moodTrackUserName");

if (welcomeTitle && savedUserName) {
    welcomeTitle.textContent = "Welcome to MoodTrack, " + savedUserName + "!";
}
document.getElementById("saveProfile").addEventListener("click", function() {
    const name = document.getElementById("userName").value.trim();

    if (name) {
        document.getElementById("welcomeTitle").textContent =
            "Welcome to MoodTrack, " + name + "!";
    }
});