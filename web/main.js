const mapImage = document.getElementById('mapImage');
const svgContainer = document.getElementById('svgContainer');

const addCalloutButton = document.getElementById('addButton');
const delCalloutButton = document.getElementById('delButton');

let displayedCallouts = {};
let calloutStack = [];

function updateMapImage() {
    const selectedMap = document.getElementById('mapSelector').value;
    console.log('Selected image path:', 'images/maps/' + selectedMap + '_unlabeled.png');
    mapImage.setAttribute("xlink:href", 'images/maps/' + selectedMap + '_unlabeled.png');

    calloutJson = fetch('settings/' + selectedMap + '_callouts.json')
        .then((response) => response.json())
        .then((json) => displayedCallouts = json);
}

function addCalloutText(text, topX, topY, bottomX, bottomY) {

    // How much to offset position of label
    var boxHeightOffset = (bottomY - topY) / 2;
    var boxWidthOffset = (bottomX - topX) / 2;

    // Creates text and adds it to svg
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.textContent = text;
    textElement.setAttribute("x", topX + boxWidthOffset);
    textElement.setAttribute("y", topY + boxHeightOffset);
    textElement.setAttribute("dominant-baseline", "middle");
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("font-family", "Times New Roman");
    textElement.setAttribute("font-size", "10px");
    textElement.setAttribute("font-weight", "bold");
    textElement.setAttribute("style", "user-select: none; fill: white;");
    textElement.setAttribute("visibility", "visible");
    textElement.setAttribute("pointer-events", "none");

    if (boxHeightOffset > boxWidthOffset) {
        textElement.setAttribute("writing-mode", "vertical-rl");
        textElement.setAttribute("font-family", "Times New Roman");
        textElement.setAttribute("style", "user-select: none; fill: white; writing-mode: vertical-rl; font-family: Times New Roman;");
    }

    svgContainer.appendChild(textElement);
    calloutStack.push(textElement);
}

function drawMapCallouts() {

    // Loop and display all keys in json
    for (const callout in displayedCallouts) {
        var points = displayedCallouts[callout];
        addCalloutText(callout, points[0], points[1], points[2], points[3]);
    }
}

// Removes all text on the image
function clearMapText() {
    while (calloutStack.length > 0) {
        svgContainer.removeChild(calloutStack.pop());
    }
}

let gameRunning = false;
let calloutName;
let calloutData = {};
let failedAttempts = 0;
const maxFailedAttempts = 3; // Set the number of allowed failed attempts

function toggleGameLoop() {
    gameRunning = !gameRunning;
    document.getElementById('gameButton').innerText = gameRunning ? 'Stop Game' : 'Start Game';
    const currentMap = document.getElementById('mapSelector').value;
    const gameMode = document.getElementById('gamemodeSelector').value;

    if (gameRunning) {
        // Disable Dropdown Menu
        document.getElementById('mapSelector').disabled = true;
        document.getElementById('gamemodeSelector').disabled = true;
        document.getElementById('mapSelector').classList.add('disabled-dropdown');   
        document.getElementById('gamemodeSelector').classList.add('disabled-dropdown');    

        if (gameMode === 'Vocal') {
            eel.get_random_image(currentMap.replace('_labeled.png', ''))(function(imagePath) {
                console.log('Received image path:', imagePath);
                if (imagePath) {
                    const fullPath = 'images/maps/Vocal/' + currentMap.split('_')[0].toLowerCase() + '/' + imagePath; 
                    console.log('Full image path:', fullPath);
                    mapImage.src = fullPath;
                } else {
                    mapImage.src = 'images/maps/' + currentMap;
                }
            });
        } else {
            mapSelector.disabled = true;
            mapSelector.classList.add('disabled-dropdown');

            // Clear callouts 
            clearMapText();

            // Reset failed attempts counter
            failedAttempts = 0;

            // Get the Callout
            getNextCallout(currentMap);
        }
    } else {
        // Enable the dropdown and update its appearance
        document.getElementById('mapSelector').disabled = false;
        document.getElementById('gamemodeSelector').disabled = false;
        document.getElementById('mapSelector').classList.remove('disabled-dropdown');
        document.getElementById('gamemodeSelector').classList.remove('disabled-dropdown');

        // Remove callout text
        document.getElementById('calloutDisplay').innerText = "";

        // Switch back to the labeled version 
        drawMapCallouts();
    }
}

let removeCallout = false;
let editCallout = true;
let addCallout = false;

function setRemoveFlag() {
    removeCallout = true;
}
function setAddFlag() {
    addCallout = true;
    editCallout = false;
}

function getNextCallout(currentMap) {
    eel.get_random_callout(currentMap)(function (callout) {
        if (callout) {
            // Display the callout name and store the data
            calloutName = callout[0];
            document.getElementById('calloutDisplay').innerText = `${callout[0]}`;
            calloutData = callout[1];
            console.log("calloutData:", calloutData); // Print callout[1] to the console
        } else {
            document.getElementById('calloutDisplay').innerText = "No callout found";
            calloutData = {};  // Reset the data if none found
        }
    });
}

mapImage.addEventListener('click', function (event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the image
    const y = event.clientY - rect.top;  // Y coordinate relative to the image
    console.log(`Clicked at x: ${x}, y: ${y}`);

    if (gameRunning) {
        if (x >= calloutData[0] && y >= calloutData[1] && x <= calloutData[2] && y <= calloutData[3]) {
            clearMapText();
            // Reset failed attempts counter
            failedAttempts = 0;
            // Get the next callout
            getNextCallout(document.getElementById('mapSelector').value);
        } else {
            failedAttempts++;
            if (failedAttempts >= maxFailedAttempts) {
                // Highlight the correct callout area
                addCalloutText(calloutName, calloutData[0], calloutData[1], calloutData[2], calloutData[3]);
            }
        }
    }
    else if (removeCallout) {
        removeCallout = false

        // Loop over callouts and find the one at clicked location
        for (const key in displayedCallouts) {
            const points = displayedCallouts[key];

            // Checks if it is the current callout and removes callout if so
            if (x >= points[0] && y >= points[1] && x <= points[2] && y <= points[3]) {
                delete displayedCallouts[key];
                clearMapText();
                drawMapCallouts();
                return;
            }
        }
    }
    else if (editCallout) {
        // Loop over callouts and find the one at clicked location
        for (const key in displayedCallouts) {
            const points = displayedCallouts[key];

            // Checks if it is the current callout and changes name if so
            if (x >= points[0] && y >= points[1] && x <= points[2] && y <= points[3]) {
                const calloutName = prompt("Enter a new callout name:")
                if (calloutName !== null) {
                    displayedCallouts[calloutName] = displayedCallouts[key];
                    delete displayedCallouts[key];
                    clearMapText();
                    drawMapCallouts();
                }
                return;
            }
        }
    }
    editCallout = true
});

function initSelectCalloutLocation() {

    // Code to edit callout boxes
    let topX, topY, bottomX, bottomY;
    mapImage.addEventListener('mousedown', function (event) {
        if (addCallout) {
            const rect = this.getBoundingClientRect();
            topX = event.clientX - rect.left;
            topY = event.clientY - rect.top;
        }
    });

    mapImage.addEventListener('mouseup', function (event) {
        if (addCallout) {
            addCallout = false;

            const rect = this.getBoundingClientRect();
            bottomX = event.clientX - rect.left;
            bottomY = event.clientY - rect.top;

            const calloutName = prompt("Enter a callout name:")

            // Ensures top point is always left and upper most
            if (topX > bottomX) {
                const tmp = topX;
                topX = bottomX;
                bottomX = tmp;
            }
            if (topY > bottomY) {
                const tmp = topY;
                topY = bottomY;
                bottomY = tmp;
            }

            if (calloutName !== null) {
                addCalloutText(calloutName, topX, topY, bottomX, bottomY);
                displayedCallouts[calloutName] = [topX, topY, bottomX, bottomY];
                console.log(displayedCallouts);
            }
        }
    });
}

let isFirstLoad = true;
mapImage.addEventListener('load', () => {
    if (isFirstLoad) {
        updateMapImage();
        isFirstLoad = false;
    }
    clearMapText();
    drawMapCallouts();
});

window.onload = () => {
    initSelectCalloutLocation();
    updateMapImage();
}
