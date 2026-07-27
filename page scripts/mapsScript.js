window.addEventListener("DOMContentLoaded", pageLoaded); 

let zoom = 1.0;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let dragged = false;
let isDragging = false

function pageLoaded() {

    //loads buttons and map
    loadCategoryButtons();
    buildButtons();
    loadMap("political");


    // Setup map zoom and drag event listeners
    document.getElementById("atlasMap").addEventListener("pointerup", function() {
        if (!dragged) {openFullscreen();
    }});
    document.getElementById("mapOverlay").addEventListener("click", overlayClicked); // closes the fullscreen map if the user clicks outside of the map
    document.getElementById("overlayMap").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("overlayMap").addEventListener("wheel", zoomMap);
    document.getElementById("overlayMap").addEventListener("dblclick", resetZoom);
    document.addEventListener("keydown", function(event) { // closes the fullscreen map if the esc key is pressed
        if (event.key === "Escape") {
            closeFullscreen();
        }
    });
    document.getElementById("overlayMap").addEventListener("pointerdown", startDrag);
    document.addEventListener("pointermove", dragMap);
    document.addEventListener("pointerup", stopDrag);
    document.addEventListener("pointercancel", stopDrag);
}

function changeMap(event) { //gets the map selected and sends it through the loadmap function
    let mapName = event.target.dataset.map;
    loadMap(mapName);
}

function loadMap(mapName) {
    let map = atlasMaps[mapName];

    if (!map) {
        console.error("Map not found:", mapName);
        return;
    }

    let image = document.getElementById("atlasMap");
    image.src = map.image;
    image.alt = map.title;

    //changes the title and description to match the new map
    document.getElementById("mapTitle").textContent = map.title;
    document.getElementById("mapDescription").textContent = map.description;

    //sets the old button as inactive by removing the active class while adding active to the pressed button
    let buttons = document.querySelectorAll(".mapButton");
    for (let button of buttons) {
        button.classList.remove("active");

        if (button.dataset.map === mapName) {
            button.classList.add("active");
        }
    }
}

//  || Handles the building the buttons and collapse/unfolding them ||
//  \/..............................................................\/

function buildButtons() {
    let general = document.getElementById("generalButtons");
    let demographics = document.getElementById("demographicButtons");
    let historical = document.getElementById("historicalButtons")

    //sorts the buttons alphabetticly before creating them
    let sortedKeys = Object.keys(atlasMaps).sort(function(a, b) {
        return atlasMaps[a].sortName.localeCompare(atlasMaps[b].sortName);
    });

    //clears existing buttons to avoid duplicates
    general.innerHTML = "";
    demographics.innerHTML = "";
    historical.innerHTML = "";

    for (let key of sortedKeys) {
        let map = atlasMaps[key];
        let button = document.createElement("button");
        button.className = "mapButton";
        button.dataset.map = key;
        button.textContent = map.buttonText;
        button.addEventListener("click", changeMap);

        //builds the buttons in the respective category
        if (map.category === "general") {
            general.appendChild(button);
        }
        else if (map.category === "demographics") {
            demographics.appendChild(button);
        }
        else if (map.category === "historical") {
            historical.appendChild(button);
        }
        else {
            console.error("Map category not handled:", map.category);
        }
    }
}

function loadCategoryButtons() {
    let headers = document.querySelectorAll(".buttonGroupHeader");
    for (let header of headers) {
        header.addEventListener("click", toggleCategory);
    }
}

//shows or hides the buttons when the header is clicked.
function toggleCategory(event) {

    let header = event.currentTarget;
    let group = header.closest(".buttonGroup");
    let content = group.querySelector(".buttonGroupContent");

    content.classList.toggle("show");

    //changes the arrow on the header to show if it is expanded or not
    if (content.classList.contains("show")) {
        header.textContent = "▼ " + header.dataset.title;
    }
    else {
        header.textContent = "► " + header.dataset.title;
    }
}

//  || Handles the map zoom and drag feature ||
//  \/.......................................\/

function openFullscreen() { // opens the fullscreen map
    let overlay = document.getElementById("mapOverlay");
    let overlayMap = document.getElementById("overlayMap");
    let atlasMap = document.getElementById("atlasMap");

    overlayMap.src = atlasMap.src;
    overlayMap.alt = atlasMap.alt;
    zoom = 1.0;
    translateX = 0;
    translateY = 0;
    updateTransform();
    overlay.classList.add("show");
}

function overlayClicked() {
    if (dragged === true) {
        return;
    }
    closeFullscreen();
}

function closeFullscreen() { // closes the fullscreen map
    let overlay = document.getElementById("mapOverlay");
    overlay.classList.remove("show");
}

function zoomMap(event) {
    event.preventDefault(); // Stops the browser from scrolling

    const overlayMap = document.getElementById("overlayMap");
    const rect = overlayMap.getBoundingClientRect();

    // acquires the mouse position relative to the map
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const oldZoom = zoom;

    if (event.deltaY < 0) {
        zoom += 0.2;
    }
    else {
        zoom -= 0.2;
    }

    zoom = Math.max(1, Math.min(zoom, 5));

    const scale = zoom / oldZoom;

    // makes the point underneath the mouse stationary
    translateX -= mouseX * (scale - 1);
    translateY -= mouseY * (scale - 1);

    updateTransform();
}

function resetZoom() {
    zoom = 1.0;
    translateX = 0;
    translateY = 0;
    updateTransform();
}

function startDrag(event) {
    if (zoom <= 1) {
        return;
    }
    isDragging = true;
    dragged = false;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;
    event.target.style.cursor = "grabbing";
}

function dragMap(event) { //transforms the map basing on mouse movements
    if (!isDragging) {
        return;
    }
    dragged = true;
    translateX = (event.clientX - startX);
    translateY = (event.clientY - startY);

    updateTransform();
}

function stopDrag() {
    isDragging = false;
    document.getElementById("overlayMap").style.cursor = "grab";

    setTimeout(function() { // prevents closing the fullscreen map if the drag ends with the cursor outside of the map
        dragged = false;
    }, 0)
}

//handles the map transformation
function updateTransform() {
    let overlayMap  = document.getElementById("overlayMap");
    overlayMap.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoom})`;
}