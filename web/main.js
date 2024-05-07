
function updateMapImage() {
    const selectedMap = document.getElementById('mapSelector').value;
    const mapImage = document.getElementById('mapImage');
    console.log('Selected image path:', 'images/maps/' + selectedMap);
    mapImage.src = 'images/maps/' + selectedMap;
}

let gameRunning = false;
function toggleGameLoop() {
    gameRunning = !gameRunning;
    document.getElementById('gameButton').innerText = gameRunning ? 'Stop Game' : 'Start Game';
    const mapImage = document.getElementById('mapImage');
    const currentMap = document.getElementById('mapSelector').value;

    if (gameRunning) {
        // Disable Dropdown Menu
        mapSelector.disabled = true;
        mapSelector.classList.add('disabled-dropdown');        

        // Switch Map to unlabeled
        let unlabeledVersion = currentMap.replace('_labeled', '_unlabeled');
        mapImage.src = 'images/maps/' + unlabeledVersion;
        
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
        let labeledVersion = currentMap.replace('_unlabeled', '_labeled');
        mapImage.src = 'images/maps/' + labeledVersion;

        // Clear the displayed callout
        document.getElementById('calloutDisplay').innerText = '';
    }
}

window.onload = () => {
    updateMapImage(); 
    document.addEventListener('keypress', function(event) {
        if (event.key === 'm' || event.key === 'M') {
            toggleOverlay();
        }
    });
}

let overlayVisible = false;
function toggleOverlay() {
    overlayVisible = !overlayVisible;
    const mapImage = document.getElementById('mapImage');
    const gameButton = document.getElementById('gameButton');
    
    if (overlayVisible) {
        // Display map image overlay
        mapImage.style.position = 'fixed';
        mapImage.style.top = '0';
        mapImage.style.left = '0';
        mapImage.style.background = 'rgba(0, 0, 0, 0)'; // Add a semi-transparent background

    } else {
        // Restore map image styles
        mapImage.style.position = 'static';
        mapImage.style.width = 'auto';
        mapImage.style.height = 'auto';
        mapImage.style.zIndex = 'auto';
        mapImage.style.background = 'none';
    }

}