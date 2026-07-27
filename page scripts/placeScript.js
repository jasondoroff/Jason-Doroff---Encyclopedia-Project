window.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() { //initializes the page and sets up event listeners
    let sortSelect = document.getElementById("sortSelect");
    let filterSelect = document.getElementById("filterSelect");

    if (!sortSelect || !filterSelect) {
        return;
    }

    sortSelect.addEventListener("change", updatePlaces);
    filterSelect.addEventListener("change", updatePlaces);
    updatePlaces();
}

function loadButtons() { //loads the toggle buttons and sets up event listeners
    let headers = document.querySelectorAll(".entryHeader");

    for (let header of headers) {
        header.addEventListener("click", toggleEntry);
    }
}

function updatePlaces() { //reloads, filters, sorts, then displays place entries
    let entries = [...placeEntries];
    let filterValue = document.getElementById("filterSelect").value;
    entries = filterEntries(entries, filterValue);

    let sortValue = document.getElementById("sortSelect").value;
    if (sortValue === "alpha") { //sorts entries alphabetically
        entries.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }
    if (sortValue === "population") { //sorts entries by population from highest to lowest
        entries.sort((a, b) => b.population - a.population);
    }
    displayEntries(entries);
    loadButtons();
}

function filterEntries(entries, filterValue) { //filters out all entries that don't match the filter value if the filter value isn't set to all
    entries = entries.filter(entry => filterValue === "all" || entry.continent.toLowerCase() === filterValue);
    return entries;
}

function displayEntries(entries) { //displays the place entries in the proper format
    let placeContent = document.getElementById("entryContent");
    placeContent.innerHTML = "";

    for (let entry of entries) {
        placeContent.innerHTML += `
        <article class="entryCard">
            <h3 class ="entryHeader" data-title="${entry.name}">
                ► ${entry.name}
            </h3>
            <p class="entryMeta">
                <strong>Classification:</strong> ${entry.classification}
            </p>
            <p class="entryMeta">
                <strong>Population:</strong> ${entry.populationDisplay}
            </p>
            <p class="entryMeta">
                <strong>Predominate Demographic:</strong> ${entry.demographic}
            </p>
            <p class="entryMeta">
                <strong>Location:</strong> ${entry.region}, ${entry.continent}
            </p>
            <p class="entryMeta">
                <strong>Leader:</strong> ${entry.leader}
            </p>
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