
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

window.onload = function() {
    updateMapImage();  // Ensure map image is updated on page load

    var backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.onclick = function() {
            window.location.href = 'index.html';
        };
    }
};
