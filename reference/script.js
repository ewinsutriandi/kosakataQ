const searchInput = document.getElementById('surahSearch');
const btnJuz30 = document.getElementById('btnJuz30');
const cards = document.querySelectorAll('.surah-card');

let currentSearchTerm = "";
let isJuz30Active = false;

// Function that runs every time a user types OR clicks the filter
function updateDisplay() {
    cards.forEach((card, index) => {
        const surahNumber = index + 1;
        const surahData = card.getAttribute('data-surah').toLowerCase();

        // Condition 1: Does it match the search text?
        const matchesSearch = surahData.includes(currentSearchTerm);

        // Condition 2: Does it match the Juz 30 + Fatihah rule?
        const isFatihah = surahNumber === 1;
        const isJuz30 = surahNumber >= 78 && surahNumber <= 114;
        const matchesFilter = !isJuz30Active || (isFatihah || isJuz30);

        // Final decision: Card must satisfy BOTH
        if (matchesSearch && matchesFilter) {
            card.style.display = "flex";
            // Optional: add a tiny delay to animate them back in
            setTimeout(() => card.style.opacity = "1", 10);
        } else {
            card.style.display = "none";
            card.style.opacity = "0";
        }
    });
}

// Event: User Types
searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    updateDisplay();
});

// Event: User Clicks Filter
btnJuz30.addEventListener('click', () => {
    isJuz30Active = !isJuz30Active;
    btnJuz30.classList.toggle('active');
    updateDisplay();
});