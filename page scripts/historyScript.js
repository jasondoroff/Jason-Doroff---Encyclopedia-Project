window.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() { //initializes the page and sets up event listeners
    let sortSelect = document.getElementById("sortSelect");
    let filterSelect = document.getElementById("filterSelect");

    if (!sortSelect || !filterSelect) {
        return;
    }

    sortSelect.addEventListener("change", updateHistory);
    filterSelect.addEventListener("change", updateHistory);
    updateHistory();
}

function loadButtons() { //loads the toggle buttons and sets up event listeners
    let headers = document.querySelectorAll(".entryHeader");

    for (let header of headers) {
        header.addEventListener("click", toggleEntry);
    }
}

function updateHistory() { //reloads, filters, sorts, then displays history entries
    let entries = [...historyEntries];
    let filterValue = document.getElementById("filterSelect").value;
    entries = filterEntries(entries, filterValue);

    let sortValue = document.getElementById("sortSelect").value;
    if (sortValue === "alpha") { //sorts entries alphabetically
        entries.sort(function(a, b) {
            return a.sortTitle.localeCompare(b.sortTitle);
        });
    }
    if (sortValue === "date") { //sorts entries by date
        entries.sort((a, b) => a.year - b.year);
    }
    displayEntries(entries);
    loadButtons();
}

function filterEntries(entries, filterValue) { //filters out all entries that don't match the filter value unless the filtervalue is set to all
    entries = entries.filter(entry => filterValue === "all" || entry.continent.toLowerCase() === filterValue);
    return entries;
}

function displayEntries(entries) { //displays the history entries in the proper format
    let historyContent = document.getElementById("entryContent");
    historyContent.innerHTML = "";

    for (let entry of entries) {
        historyContent.innerHTML += `
        <article class="entryCard">
            <h3 class ="entryHeader" data-title="${entry.title}">
                ► ${entry.title}
            </h3>
            <p class="entryMeta">
                <strong>Year:</strong> ${entry.year}
            </p>
            <p class="entryMeta">
                <strong>Location:</strong> ${entry.region}, ${entry.continent}
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

    text.classList.toggle("show");

    if (!text) {
        return;
    }

    if (text.classList.contains("show")) { //changes to arrow to its correct state based on if it has the show class
        header.innerHTML = "▼ " + header.dataset.title;
    }
    else {
        header.innerHTML = "► " + header.dataset.title;
    }
}