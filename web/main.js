import { MicInput } from './MicInput.js';
import { MapStorage } from './MapStorage.js';
import { FirebaseAppConnection } from './FirebaseAppConnection.js';

const mapImage = document.getElementById('mapImage');
const svgContainer = document.getElementById('svgContainer');
const startButton = document.getElementById('startButton');
const saveButton = document.getElementById('saveButton');
const mapSelector = document.getElementById('mapSelector');
const calloutDisplayText = document.getElementById('calloutDisplay');
const addCalloutButton = document.getElementById('addButton');
const delCalloutButton = document.getElementById('delButton');

const firebaseConnection = new FirebaseAppConnection();
const mapStorage = new MapStorage(firebaseConnection.getApp());

let displayedCallouts = {};
let calloutTextObjectStack = [];

function updateMapImage() {
    clearMapText();
    
    const selectedMap = mapSelector.value;
    console.log('Selected image path:', 'images/maps/' + selectedMap + '_unlabeled.png');
    mapImage.setAttribute("xlink:href", 'images/maps/' + selectedMap + '_unlabeled.png');

    mapStorage.getMapDataByUUID(selectedMap, 'default')
    .then((data) => {
        displayedCallouts = data;
        drawMapCallouts();
    })
    .catch((error) => {
        console.error("Error getting map data:", error);
    });
}

mapSelector.addEventListener('change', () => {
    updateMapImage();
});

function addCalloutText(text, topX, topY, bottomX, bottomY) {

    // How much to offset position of label
    var boxHeightOffset = (bottomY - topY)/2;
    var boxWidthOffset = (bottomX - topX)/2;

    // Creates text and adds it to svg
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.textContent = text;
    textElement.setAttribute("x", topX + boxWidthOffset);
    textElement.setAttribute("y", topY + boxHeightOffset);
    textElement.setAttribute("dominant-baseline", "middle");
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("font-family", "Sitka Small");
    textElement.setAttribute("font-size", "10px");
    textElement.setAttribute("font-weight", "bold");
    textElement.setAttribute("style", "user-select: none; fill: white;");
    textElement.setAttribute("visibility", "visible");
    textElement.setAttribute("pointer-events", "none");

    if (boxHeightOffset > boxWidthOffset) {
        textElement.setAttribute("writing-mode", "vertical-rl");
    }

    svgContainer.appendChild(textElement);
    calloutTextObjectStack.push(textElement);
}

function drawMapCallouts() {

    // Loop and display all keys in json
    for (const callout in displayedCallouts) {
        if (callout !== null) {
            var points = displayedCallouts[callout];
        }
        addCalloutText(callout, points[0], points[1], points[2], points[3]);
    }
}

// Removes all text on the image
function clearMapText() {
    while (calloutTextObjectStack.length > 0) {
        svgContainer.removeChild(calloutTextObjectStack.pop());
    }
}

let gameRunning = false;
let calloutLocation = [];
function toggleGameLoop() {
    gameRunning = !gameRunning;
    startButton.innerText = gameRunning ? 'Stop Game' : 'Start Game';
    const currentMap = document.getElementById('mapSelector').value;

    if (gameRunning) {
        // Disable Dropdown Menu
        mapSelector.disabled = true;
        mapSelector.classList.add('disabled-dropdown');        

        // Clear callouts 
        clearMapText();
        
        // Get the Callout
        getNextCallout(currentMap);

    } else {
        // Enable the dropdown and update its appearance
        mapSelector.disabled = false;
        mapSelector.classList.remove('disabled-dropdown');

        // Remove callout text
        calloutDisplayText.innerText = "";

        // Switch back to the labeled version 
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

function getNextCallout() {
    var calloutKeys = Object.keys(displayedCallouts);
    var randomKey = calloutKeys[Math.floor(Math.random() * calloutKeys.length)];
    console.log(randomKey);
    if (randomKey) {
        // Display the callout name and store the data
        calloutDisplayText.innerText = `${randomKey}`;
        calloutLocation = displayedCallouts[randomKey];
    } else {
        calloutDisplayText.innerText = "No callout found";
        calloutLocation = [];  // Reset the data if none found
    }
    console.log(calloutLocation);
}

// Saves any changes to callouts
saveButton.addEventListener('click', () => {
    const selectedMap = mapSelector.value;
    mapStorage.setMapDataByUUID(selectedMap, displayedCallouts, 'default')
});

function removeCallout() {
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

mapImage.addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the image
    const y = event.clientY - rect.top;  // Y coordinate relative to the image
    console.log(`Clicked at x: ${x}, y: ${y}`);

    if (gameRunning) {
        if (x >= calloutLocation[0] && y >= calloutLocation[1] && x <= calloutLocation[2] && y <= calloutLocation[3]) {
            console.log("Correct callout clicked!");

            // Get the next callout
            getNextCallout(document.getElementById('mapSelector').value);
        } else {
            console.log("Incorrect area, try again.");
        }
    }
    else if (shouldRemoveCallout) {
        removeCallout();
        shouldRemoveCallout = false;
    }
    else if (shouldEditCallout) {
        editCallout(x, y);
    }
    shouldEditCallout = true;
});

function initSelectCalloutLocation() {

    // Code to edit callout boxes
    let topX, topY, bottomX, bottomY;

    // Find image rectangle
    mapImage.addEventListener('mousedown', function(event) {
        if (shouldAddCallout) {
            const rect = this.getBoundingClientRect();
            topX = event.clientX - rect.left;
            topY = event.clientY - rect.top;
        }
    });

    mapImage.addEventListener('mouseup', function(event) {
        if (shouldAddCallout) {
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

            // Adds callout text
            if (calloutName !== null) {
                addCalloutText(calloutName, topX, topY, bottomX, bottomY);
                displayedCallouts[calloutName] = [topX, topY, bottomX, bottomY];
                console.log(displayedCallouts);
            } 

            shouldAddCallout = false;
        }
    });
}

let isStarted = false;
function setVoiceCalloutHotkey(key) {
    let speechToText = new MicInput();

    document.addEventListener('keydown', (event) => {
        if (!isStarted) {

            // Check if the key pressed is the 's' key for start recording
            if (event.key === key) {
                isStarted = true;
                speechToText.startRecording();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (isStarted) {

            // Check if the key pressed is the 's' key for start recording
            if (event.key === key) {

                // Wait 300ms before stopping recording 
                setTimeout(() => {
                    isStarted = false;
                    speechToText.stopRecording();
                }, 300);
            }
        }

        // // Gets words in the speech transcript
        // const wordsInTranscript = speechToText.getSpeechTranscript().split(' ');

        // // Check if any words appear in callout
        // wordsInTranscript.forEach(curWord => {
        //     if (CALLOUT_NAME.toLocaleLowerCase().includes(curWord.toLocaleLowerCase())) {
        //         // Change map displayed
        //     }
        // });
    });
}

window.onload = () => {
    initSelectCalloutLocation();
    setVoiceCalloutHotkey('t');
    updateMapImage();
}
