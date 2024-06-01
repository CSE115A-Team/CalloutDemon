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
        }
    } else {
        // Enable the dropdown and update its appearance
        document.getElementById('mapSelector').disabled = false;
        document.getElementById('gamemodeSelector').disabled = false;
        document.getElementById('mapSelector').classList.remove('disabled-dropdown');
        document.getElementById('gamemodeSelector').classList.remove('disabled-dropdown');

        // Switch back to the labeled version 
        let labeledVersion = currentMap.replace('_unlabeled', '_labeled');
        mapImage.src = 'images/maps/' + labeledVersion;

        // Clear the displayed callout
        document.getElementById('calloutDisplay').innerText = '';
    }
}

window.onload = () => {
    updateMapImage(); 
};
