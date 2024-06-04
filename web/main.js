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

function createRectangleElement(topX, topY, bottomX, bottomY) {
    var rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectElement.setAttribute("x", topX);
    rectElement.setAttribute("y", topY);
    rectElement.setAttribute("width", bottomX - topX);
    rectElement.setAttribute("height", bottomY - topY);
    rectElement.setAttribute("fill", "rgba(0, 0, 255, 0.3)");
    rectElement.setAttribute("rx", "5"); // Rounded corners
    rectElement.setAttribute("ry", "5"); // Rounded corners
    return rectElement;
}


function createTextElement(text) {
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.textContent = text;
    textElement.setAttribute("dominant-baseline", "middle");
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("font-family", "Times New Roman");
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
    textElement.textContent = text;
    textElement.setAttribute("x", topX + boxWidthOffset);
    textElement.setAttribute("y", topY + boxHeightOffset);

    if (boxHeightOffset > boxWidthOffset) {
        textElement.setAttribute("writing-mode", "vertical-rl");
    }

    var rectangleElement = createRectangleElement(topX, topY, bottomX, bottomY);
    svgContainer.appendChild(textElement);
    calloutStack.push(textElement);

    svgContainer.appendChild(rectangleElement);
    calloutStack.push(rectangleElement);
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
let calloutData = {}; 
function toggleGameLoop() {
    gameRunning = !gameRunning;
    document.getElementById('gameButton').innerText = gameRunning ? 'Stop Game' : 'Start Game';
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
    eel.get_random_callout(currentMap)(function(callout) {
        if (callout) {
            // Display the callout name and store the data
            document.getElementById('calloutDisplay').innerText = `${callout[0]}`;
            calloutData = callout[1];
            console.log("calloutData:", calloutData); // Print callout[1] to the console
        } else {
            document.getElementById('calloutDisplay').innerText = "No callout found";
            calloutData = {};  // Reset the data if none found
        }
    });
}

svgContainer.addEventListener('click', function(event) {
    const rect = mapImage.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the image
    const y = event.clientY - rect.top;  // Y coordinate relative to the image
    console.log(`Clicked at x: ${x}, y: ${y}`);

    if (gameRunning) {
        // Send coordinates to Python only if the game is running
        eel.receive_coordinates(x, y);
        if (x >= calloutData[0] && y >= calloutData[1] && x <= calloutData[2] && y <= calloutData[3]) {
            console.log("Correct callout clicked!");
            // Get the next callout
            getNextCallout(document.getElementById('mapSelector').value);
        } else {
            console.log("Incorrect area, try again.");
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

let isDragging = false;
function initSelectCalloutLocation() {

    // Code to edit callout boxes
    let topX, topY, bottomX, bottomY;
    
    let startX, startY, rectElement = null;
    svgContainer.addEventListener('mousedown', (event) => {
        if (addCallout) {
            //Ray's code
            isDragging = true;
            startX = event.offsetX;
            startY = event.offsetY;
            
            rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rectElement.setAttribute("x", startX);
            rectElement.setAttribute("y", startY);
            rectElement.setAttribute("width", 0);
            rectElement.setAttribute("height", 0);
            rectElement.setAttribute("fill", "rgba(0, 0, 255, 0.3)");
            rectElement.setAttribute("stroke", "blue");
            rectElement.setAttribute("stroke-width", 1);
            
            const rect = mapImage.getBoundingClientRect();
            topX = event.clientX - rect.left;
            topY = event.clientY - rect.top;

            //Ray's code
            svgContainer.appendChild(rectElement);
        }
    });

    svgContainer.addEventListener('mouseup', (event) => {
        if (addCallout) {

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

            if (calloutName !== null) {
                addCalloutText(calloutName, topX, topY, bottomX, bottomY);
                displayedCallouts[calloutName] = [topX, topY, bottomX, bottomY];
                console.log(displayedCallouts);
            } 
        }

        if (rectElement) {
            svgContainer.removeChild(rectElement);
            rectElement = null;
        }
    
        isDragging = false;
        addCallout = false;
    });

    //Ray's code
    svgContainer.addEventListener("mousemove", (event) => {
        if (!isDragging) {
            if (rectElement) {
                svgContainer.removeChild(rectElement);
                rectElement = null;
            }
            return;
        } 

        const currentX = event.offsetX;
        const currentY = event.offsetY;

        const rectX = Math.min(currentX, startX);
        const rectY = Math.min(currentY, startY);
        const rectWidth = Math.abs(currentX - startX);
        const rectHeight = Math.abs(currentY - startY);

        rectElement.setAttribute("x", rectX);
        rectElement.setAttribute("y", rectY);
        rectElement.setAttribute("width", rectWidth);
        rectElement.setAttribute("height", rectHeight);
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

