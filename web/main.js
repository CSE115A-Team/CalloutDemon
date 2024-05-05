const mapImage = document.getElementById('mapImage');
const svgContainer = document.getElementById('svgContainer');

function updateMapImage() {

    clearMapText();
    const selectedMap = document.getElementById('mapSelector').value;
    console.log('Selected image path:', 'images/maps/' + selectedMap);
    mapImage.setAttribute("xlink:href", 'images/maps/' + selectedMap);
}

function clearMapText() {
    var svgElements = svgContainer.childNodes;

    for (var i = 0; i < svgElements.length; i++) {
        if (svgElements[i].nodeName === "text") {
            svgContainer.removeChild(svgElements[i]);
        }
    }
}

let gameRunning = false;
let calloutData = {}; 
function toggleGameLoop() {
    clearMapText();
    gameRunning = !gameRunning;
    document.getElementById('gameButton').innerText = gameRunning ? 'Stop Game' : 'Start Game';
    const currentMap = document.getElementById('mapSelector').value;

    if (gameRunning) {
        // Disable Dropdown Menu
        mapSelector.disabled = true;
        mapSelector.classList.add('disabled-dropdown');        

        // Switch Map to unlabeled
        let unlabeledVersion = currentMap.replace('_labeled', '_unlabeled');
        mapImage.setAttribute("xlink:href", 'images/maps/' + unlabeledVersion);
        
        // Get the Callout
        eel.get_random_callout(currentMap.replace('_labeled.png', ''))(function(callout) {
            if (callout) {
                // Display the callout name and store the data
                document.getElementById('calloutDisplay').innerText = `${callout[0]}`;
                calloutData = callout[1];
            } else {
                document.getElementById('calloutDisplay').innerText = "No callout found";
                calloutData = {};  // Reset the data if none found
            }
        });

    } else {
        // Enable the dropdown and update its appearance
        mapSelector.disabled = false;
        mapSelector.classList.remove('disabled-dropdown');

        // Switch back to the labeled version 
        updateMapImage();
    }
}


mapImage.addEventListener('click', function(event) {
    if (gameRunning) {
        const rect = this.getBoundingClientRect();
        const x = event.clientX - rect.left; // X coordinate relative to the image
        const y = event.clientY - rect.top;  // Y coordinate relative to the image
        console.log(`Clicked at x: ${x}, y: ${y}`);

        // Send coordinates to Python only if the game is running
        eel.receive_coordinates(x, y);
    }
});

function addCallout(text, topX, topY, bottomX, bottomY) {

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
    textElement.setAttribute("font-family", "Arial");
    textElement.setAttribute("font-size", "10px");
    textElement.setAttribute("font-weight", "bold");
    textElement.setAttribute("style", "user-select: none;");

    if (boxHeightOffset > boxWidthOffset) {
        textElement.setAttribute("style", "writing-mode: vertical-rl;");
    }

    svgContainer.appendChild(textElement);
}

// Code to edit callout boxes
let topX, topY, bottomX, bottomY;
mapImage.addEventListener('mousedown', function(event) {
    const rect = this.getBoundingClientRect();
    topX = event.clientX - rect.left;
    topY = event.clientY - rect.top;
});

mapImage.addEventListener('mouseup', function(event) {
    const rect = this.getBoundingClientRect();
    bottomX = event.clientX - rect.left;
    bottomY = event.clientY - rect.top;

    const calloutName = prompt("Enter a callout name:")

    if (calloutName !== null) {
        addCallout(calloutName, topX, topY, bottomX, bottomY);
    } 
});

window.onload = () => {
    updateMapImage(); 
    setupImageClickEvent();
}