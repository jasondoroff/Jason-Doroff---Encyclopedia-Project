window.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() { //initializes the page and sets up event listeners
    let sortSelect = document.getElementById("sortSelect");
    let filterSelect = document.getElementById("filterSelect");

    if (!sortSelect || !filterSelect) {
        return;
    }

    sortSelect.addEventListener("change", updateCharacters);
    filterSelect.addEventListener("change", updateCharacters);
    updateCharacters();
}

function loadButtons() { //loads the toggle buttons and sets up event listeners
    let headers = document.querySelectorAll(".entryHeader");

    for (let header of headers) {
        header.addEventListener("click", toggleEntry);
    }
}

function updateCharacters() { //reloads, filters, sorts, then displays character profiles
    let entries = [...characterProfiles];
    let filterValue = document.getElementById("filterSelect").value;
    entries = filterEntries(entries, filterValue);

    let sortValue = document.getElementById("sortSelect").value;
    if (sortValue === "alpha") { //sorts profiles alphabetically by name
        entries.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }
    else if (sortValue === "date") { //sorts profiles by age
        entries.sort((a, b) => a.age - b.age);
    }
    displayEntries(entries);
    loadButtons();
}

function filterEntries(entries, filterValue) { //filters out all entries that don't match the filter value unless the filter is set to all
    entries = entries.filter(entry => filterValue === "all" || (entry.tags || []).some(tag => tag.toLowerCase().replace(/\s+/g, "") === filterValue));
    return entries;
}

function displayEntries(entries) { //displays the character profiles in the proper format
    let entryContent = document.getElementById("entryContent");
    entryContent.innerHTML = "";

    for (let entry of entries) {
        entryContent.innerHTML += `
        <article class="entryCard">
            <h3 class="entryHeader" data-title="${entry.name}">
                ► ${entry.name}
            </h3>
            <div class="characterCard">
            <img class="entryImage" src="${entry.picture}" alt="${entry.name}">
                <div class="characterInfo">
                    <p class="entryMeta">
                        <strong>Age:</strong> ${entry.age}
                    </p>
                    <p class="entryMeta">
                        <strong>Species:</strong> ${entry.species}
                    </p>
                    <p class="entryMeta">
                        <strong>Class:</strong> ${entry.class}
                    </p>
                    <p class="entryMeta">
                        <strong>Homeland:</strong> ${entry.homeland}
                    </p>
                </div>
            </div>
            <div class="entryText"> ${entry.text} </div>
        </article>
        `;
    }

}

function toggleEntry(event) { //hides or unhides the full entry text
    let header = event.currentTarget;
    let article = header.closest(".entryCard");

    if (!article) {
        return;
    }

    let text = article.querySelector(".entryText");

    if (!text) {
        return;
    }

    text.classList.toggle("show");

    if (text.classList.contains("show")) { //changes to arrow to its correct state based on if it has the show class
        header.innerHTML = "▼ " + header.dataset.title;
    }
    else {
        header.innerHTML = "► " + header.dataset.title;
    }
}