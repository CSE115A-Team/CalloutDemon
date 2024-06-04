import { MicInput } from './MicInput.js';
import { MapStorage } from './MapStorage.js';
import { signInUser, signOutUser, getUserUUID } from './FirebaseAuth.js';

const mapImage = document.getElementById('mapImage');
const svgContainer = document.getElementById('svgContainer');
const startButton = document.getElementById('startButton');
const saveButton = document.getElementById('saveButton');
const mapSelector = document.getElementById('mapSelector');
const gamemodeSelector = document.getElementById('gamemodeSelector');
const calloutDisplayText = document.getElementById('calloutDisplay');
const addCalloutButton = document.getElementById('addButton');
const delCalloutButton = document.getElementById('delButton');
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

signInButton.addEventListener('click', signInUser);
signOutButton.addEventListener('click', signOutUser);

const mapStorage = new MapStorage();

let displayedCallouts = {};
let calloutTextObjectStack = [];

function updateMapImage() {
    clearMapText();
    
    const selectedMap = mapSelector.value;
    mapImage.setAttribute("xlink:href", 'images/maps/' + selectedMap + '_unlabeled.png');

    let saveLoc = getUserUUID();
    if (saveLoc == "") {
        saveLoc = "default";
    }
    mapStorage.getMapDataByUUID(selectedMap, saveLoc)
    .then((data) => {
        displayedCallouts = data;
        drawMapCallouts();
    })
    .catch((error) => {
        displayedCallouts = {};
        console.error("Error getting map data:", error);
    });
}

mapSelector.addEventListener('change', () => {
    updateMapImage();
});

function drawMapCallouts() {

    // Loop and display all keys in json
    for (const callout in displayedCallouts) {
        var points = displayedCallouts[callout];
        addCalloutText(callout, points[0], points[1], points[2], points[3]);
    }
}


function createTextElement(text) {
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.textContent = text;
    textElement.setAttribute("dominant-baseline", "middle");
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("font-family", "Sitka Small");
    textElement.setAttribute("font-size", "10px");
    textElement.setAttribute("font-weight", "bold");
    textElement.setAttribute("style", "user-select: none; fill: white;");
    textElement.setAttribute("visibility", "visible");
    textElement.setAttribute("pointer-events", "none");

    return textElement;
}

function addCalloutText(text, topX, topY, bottomX, bottomY) {

    // How much to offset position of label
    var boxHeightOffset = (bottomY - topY)/2;
    var boxWidthOffset = (bottomX - topX)/2;

    // Creates text and adds it to svg
    var textElement = createTextElement(text);
    textElement.setAttribute("x", topX + boxWidthOffset);
    textElement.setAttribute("y", topY + boxHeightOffset);

    if (boxHeightOffset > boxWidthOffset) {
        textElement.setAttribute("writing-mode", "vertical-rl");
    }

    svgContainer.appendChild(textElement);
    calloutTextObjectStack.push(textElement);
}

// Removes all text on the image
function clearMapText() {
    while (calloutTextObjectStack.length > 0) {
        svgContainer.removeChild(calloutTextObjectStack.pop());
    }
}

let gameRunning = false;
let calloutName;
let calloutLocation;

function toggleGameLoop() {
    gameRunning = !gameRunning;
    startButton.innerText = gameRunning ? 'Stop Game' : 'Start Game';
    const currentMap = mapSelector.value;
    const gameMode = gamemodeSelector.value;

    if (gameRunning) {
        // Disable Dropdown Menu
        gamemodeSelector.disabled = true;

        mapSelector.disabled = true;
        clearMapText();

        if (gameMode === 'Vocal') {
            setNextLocationImage();
        } else {

            // Reset failed attempts counter
            failedAttempts = 0;

            // Get the Callout
            getNextCallout(currentMap);
        }
    } else {
        // Enable the dropdown and update its appearance
        mapSelector.disabled = false;
        gamemodeSelector.disabled = false;

        // Remove callout text
        calloutDisplayText.innerText = "";

        // Switch back to the map
        if (gameMode === 'Vocal') {
            updateMapImage();
        }
        drawMapCallouts();
    }
}

startButton.addEventListener('click', () => {
    toggleGameLoop();
});


let shouldRemoveCallout = false;
let shouldEditCallout = true;
let shouldAddCallout = false;

delCalloutButton.addEventListener('click', () => {
    shouldRemoveCallout = true;
});

addCalloutButton.addEventListener('click', () => {
    shouldAddCallout = true;
    shouldEditCallout = false;
});

function setNextLocationImage() {
    const currentMap = mapSelector.value;

    eel.get_random_image(currentMap)((imagePath) => {
        if (imagePath) {
            mapImage.setAttribute("xlink:href", fullPath);
            
            const parts = imagePath.split("_")[1];
            calloutName = parts.split(".")[0];
        }
        else {
            updateMapImage();
        }
    });
};

function getNextCallout() {
    var calloutKeys = Object.keys(displayedCallouts);
    var randomKey = calloutKeys[Math.floor(Math.random() * calloutKeys.length)];
    if (randomKey) {
        // Display the callout name and store the data
        calloutName = randomKey;
        calloutDisplayText.innerText = `${randomKey}`;
        calloutLocation = displayedCallouts[randomKey];
    } else {
        calloutDisplayText.innerText = "No callout found";
        calloutLocation = [];  // Reset the data if none found
    }
}

// Saves any changes to callouts
saveButton.addEventListener('click', () => {
    const selectedMap = mapSelector.value;

    let saveLoc = getUserUUID();
    if (saveLoc == "") {
        mapStorage.setMapDataByUUID(selectedMap, displayedCallouts, 'default');
    } else {
        mapStorage.setMapDataByUUID(selectedMap, displayedCallouts, saveLoc);
    }
});

function removeCallout(xCoord, yCoord) {
    // Loop over callouts and find the one at clicked location
    for (const key in displayedCallouts) {
        const points = displayedCallouts[key];

        // Checks if it is the current callout and removes callout if so
        if (xCoord >= points[0] && yCoord >= points[1] && xCoord <= points[2] && yCoord <= points[3]) {
            delete displayedCallouts[key];
            clearMapText();
            drawMapCallouts();
            return;
        }
    }
}

function editCallout(xCoord, yCoord) {
    // Loop over callouts and find the one at clicked location
    for (const key in displayedCallouts) {
        const points = displayedCallouts[key];

        // Checks if it is the current callout and changes name if so
        if (xCoord >= points[0] && yCoord >= points[1] && xCoord <= points[2] && yCoord <= points[3]) {
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

let failedAttempts = 0;
const maxFailedAttempts = 3; // Set the number of allowed failed attempts
mapImage.addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the image
    const y = event.clientY - rect.top;  // Y coordinate relative to the image

    if (gameRunning) {
        if (x >= calloutLocation[0] && y >= calloutLocation[1] && x <= calloutLocation[2] && y <= calloutLocation[3]) {
            clearMapText();
            // Reset failed attempts counter
            failedAttempts = 0;
            // Get the next callout
            getNextCallout(mapSelector.value);
        } 
        else {
            failedAttempts++;
            if (failedAttempts >= maxFailedAttempts) {

                // Show the correct callout area
                addCalloutText(calloutName, calloutLocation[0], calloutLocation[1], calloutLocation[2], calloutLocation[3]);
            }
        }
    }
    else if (shouldRemoveCallout) {
        removeCallout(x, y);
        shouldRemoveCallout = false;
    }
    else if (shouldEditCallout) {
        editCallout(x, y);
    }
    shouldEditCallout = true;
});


let isDragging = false;
function initSelectCalloutLocation() {

    let topX, topY, bottomX, bottomY;
    let startX, startY, dragAreaRectangle = null;

    // Find image rectangle
    svgContainer.addEventListener('mousedown', (event) => {
        if (shouldAddCallout) {
            isDragging = true;
            startX = event.offsetX;
            startY = event.offsetY;
            
            dragAreaRectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            dragAreaRectangle.setAttribute("x", startX);
            dragAreaRectangle.setAttribute("y", startY);
            dragAreaRectangle.setAttribute("width", 0);
            dragAreaRectangle.setAttribute("height", 0);
            dragAreaRectangle.setAttribute("fill", "rgba(255, 121, 63, 0.3)");
            dragAreaRectangle.setAttribute("stroke", "orange");
            dragAreaRectangle.setAttribute("stroke-width", 1);
            svgContainer.appendChild(dragAreaRectangle);
            
            const rect = mapImage.getBoundingClientRect();
            topX = event.clientX - rect.left;
            topY = event.clientY - rect.top;

        }
    });

    svgContainer.addEventListener('mouseup', (event) => {
        if (shouldAddCallout) {
            const rect = mapImage.getBoundingClientRect();
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

            // Adds callout text
            if (calloutName !== null) {
                addCalloutText(calloutName, topX, topY, bottomX, bottomY);
                displayedCallouts[calloutName] = [topX, topY, bottomX, bottomY];
            } 
        }

        if (dragAreaRectangle) {
            svgContainer.removeChild(dragAreaRectangle);
            dragAreaRectangle = null;
        }
    
        isDragging = false;
        shouldAddCallout = false;
    });



    // Updates area for callout as mouse is moved
    svgContainer.addEventListener("mousemove", (event) => {
        if (!isDragging) {
            if (dragAreaRectangle) {
                svgContainer.removeChild(dragAreaRectangle);
                dragAreaRectangle = null;
            }
            return;
        } 

        const currentX = event.offsetX;
        const currentY = event.offsetY;

        const rectX = Math.min(currentX, startX);
        const rectY = Math.min(currentY, startY);
        const rectWidth = Math.abs(currentX - startX);
        const rectHeight = Math.abs(currentY - startY);

        dragAreaRectangle.setAttribute("x", rectX);
        dragAreaRectangle.setAttribute("y", rectY);
        dragAreaRectangle.setAttribute("width", rectWidth);
        dragAreaRectangle.setAttribute("height", rectHeight);
    });
}

let isStarted = false;

function startRecording(speechToText) {
    isStarted = true;
    speechToText.startRecording();
}

function stopRecording(speechToText, currentMap) {
    isStarted = false;
    speechToText.stopRecording();

    const speechTranscript = speechToText.getSpeechTranscript();
    speechTranscript.then((transcript) => {
        postCallout(transcript, currentMap);
    }).catch((error) => {
        console.log("Speech To Text ERROR: " + error);
    });
}

function postCallout(transcript) {
    const wordsInTranscript = transcript.split(' ');

    wordsInTranscript.forEach(curWord => {
        if (curWord !== "" && calloutName.toLowerCase().includes(curWord.toLowerCase())) {
            setNextLocationImage(); // Fetch the next image
        }
    });
}

function setVoiceCalloutHotkey(key) {
    const currentMap = mapSelector.value;
    let speechToText = new MicInput();

    document.addEventListener('keydown', (event) => {
        if (!isStarted && event.key === key) {
            startRecording(speechToText);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (isStarted && event.key === key) {
            stopRecording(speechToText, currentMap);
        }
    });
}



window.onload = () => {
    initSelectCalloutLocation();
    setVoiceCalloutHotkey('t');
    updateMapImage();
}