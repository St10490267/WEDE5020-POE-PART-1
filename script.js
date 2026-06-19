/**
 * Mabopane Community Swim Initiative (MCSI) - Core Scripting
 * Student Number: ST10490267
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. RUN INTERACTIVE ACCORDION (SERVICES PAGE) ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
            const panel = header.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // --- 2. RUN REGISTRATION FORM VALIDATION ---
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        registrationForm.addEventListener("submit", (e) => {
            let isValid = true;

            // Select Fields and Reset Errors
            const parentName = document.getElementById("parentName");
            const email = document.getElementById("email");
            const childName = document.getElementById("childName");
            const age = document.getElementById("age");
            const level = document.getElementById("level");

            clearErrors(["parentNameError", "emailError", "childNameError", "ageError", "levelError"]);

            // Field Specific Rule Checking
            if (parentName.value.trim() === "") {
                showError("parentNameError", "Guardian name cannot be blank.");
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                showError("emailError", "Please provide a valid structural email address.");
                isValid = false;
            }

            if (childName.value.trim() === "") {
                showError("childNameError", "Child's name cannot be blank.");
                isValid = false;
            }

            const ageValue = parseInt(age.value, 10);
            if (isNaN(ageValue) || ageValue < 5 || ageValue > 18) {
                showError("ageError", "Age must be an integer restricted between 5 and 18.");
                isValid = false;
            }

            if (level.value === "") {
                showError("levelError", "Please select an aptitude training option tier.");
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault(); // Stop form submission if invalid
            } else {
                alert("Registration Form Validated Successfully! Submitting registration entry data...");
            }
        });
    }

    // --- 3. RUN CONTACT FORM VALIDATION ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            let isValid = true;
            const msg = document.getElementById("msg");
            
            clearErrors(["msgError"]);

            if (msg.value.trim().length < 10) {
                showError("msgError", "Your inquiry query must contain at least 10 detailed characters.");
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                alert("Contact Message Validated! Sending...");
            }
        });
    }

    // --- 4. RUN LEAFLET MAP INTERACTION (CONTACT PAGE) ---
    if (document.getElementById("map")) {
        // Approximate Geographic Coords for Mabopane Square, South Africa
        const mabopaneCoords = [-25.4985, 28.1014]; 
        
        const map = L.map('map').setView(mabopaneCoords, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(mabopaneCoords).addTo(map)
            .bindPopup('<b>MCSI Head Office</b><br>Mabopane Square, Block B.')
            .openPopup();
    }
});

// Helper Functions for Validation System Cleanliness
function showError(elementId, message) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.color = "#d9534f";
        errorSpan.style.fontSize = "0.85rem";
        errorSpan.style.display = "block";
        errorSpan.style.marginTop = "4px";
    }
}

function clearErrors(errorIdsArray) {
    errorIdsArray.forEach(id => {
        const errorSpan = document.getElementById(id);
        if (errorSpan) {
            errorSpan.textContent = "";
            errorSpan.style.display = "none";
        }
    });
}

// --- Add this block directly inside your existing document.addEventListener("DOMContentLoaded", () => { ... }) block in js/script.js

    // --- 5. DYNAMIC CONTENT LOADING, SEARCHING & FILTERING (SERVICES) ---
    const programmesData = [
        { id: 1, name: "Water Safety 101", focus: "Floating, survival breathing, and conquering deep water fear.", minAge: 6, maxAge: 10 },
        { id: 2, name: "Beginner Strokes", focus: "Developing mechanics for Freestyle and Backstroke with rhythmic cycles.", minAge: 8, maxAge: 14 },
        { id: 3, name: "Junior Lifesaving", focus: "Comprehensive water rescue skills, basic CPR, and endurance swimming.", minAge: 15, maxAge: 18 }
    ];

    const container = document.getElementById("programmes-container");
    const searchBar = document.getElementById("searchBar");
    const sortSelector = document.getElementById("sortSelector");

    // Display function to dynamically inject elements into the layout
    function renderProgrammes(data) {
        if (!container) return; // Only execute if we are on the services page
        container.innerHTML = ""; // Clear existing elements

        if (data.length === 0) {
            container.innerHTML = `<p style="padding: 20px; color: #777; font-style: italic;">No matching programmes found matching your criteria.</p>`;
            return;
        }

        data.forEach(prog => {
            // Generate accordion elements dynamically
            const itemDiv = document.createElement("div");
            itemDiv.className = "accordion-item";
            itemDiv.style.marginBottom = "10px";

            itemDiv.innerHTML = `
                <button class="accordion-header" style="width:100%; text-align:left; background-color:#e6f2ff; color:#003366; padding:15px; font-weight:bold; border:1px solid #b3d7ff; cursor:pointer; border-radius:4px;">
                    ${prog.name} (Target Ages: ${prog.minAge} - ${prog.maxAge})
                </button>
                <div class="accordion-panel" style="max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; padding: 0 15px; background-color: white; border-left: 4px solid #003366;">
                    <p style="margin-top:10px; margin-bottom:10px;"><strong>Focus Area:</strong> ${prog.focus}</p>
                </div>
            `;

            // Setup click events for the freshly rendered dynamic elements
            const btn = itemDiv.querySelector(".accordion-header");
            btn.addEventListener("click", () => {
                btn.classList.toggle("active");
                const panel = btn.nextElementSibling;
                if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });

            container.appendChild(itemDiv);
        });
    }

    // Filter and sorting management engine
    function applyFilterAndSort() {
        if (!container) return;
        
        let filtered = programmesData.filter(prog => {
            const query = searchBar.value.toLowerCase();
            return prog.name.toLowerCase().includes(query) || prog.focus.toLowerCase().includes(query);
        });

        const sortValue = sortSelector.value;
        if (sortValue === "age-asc") {
            filtered.sort((a, b) => a.minAge - b.minAge);
        } else if (sortValue === "age-desc") {
            filtered.sort((a, b) => b.minAge - a.minAge);
        }

        renderProgrammes(filtered);
    }

    // Initialize display and hook up real-time event listeners
    if (container) {
        renderProgrammes(programmesData);
        searchBar.addEventListener("input", applyFilterAndSort);
        sortSelector.addEventListener("change", applyFilterAndSort);
    }