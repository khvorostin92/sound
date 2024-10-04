const noiseSVG = document.getElementById('noiseSVG');

function createNoiseSVG(width, height) {
    let pathData = "M 0 " + (height / 2) + " ";
    for (let x = 0; x <= width; x++) {
        // Generate random Y-value (noise)
        const y = (Math.random() - 0.5) * height;  // Random value between -height/2 and height/2
        pathData += `L ${x} ${height / 2 + y} `;
    }
    return pathData;
}

function drawNoise(svgElement) {
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');
    const pathData = createNoiseSVG(width, height);

    // Clear previous content
    svgElement.innerHTML = '';

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', pathData);
    pathElement.setAttribute('stroke', 'black');
    pathElement.setAttribute('fill', 'none');

    svgElement.appendChild(pathElement);
}

// Draw noise on load
drawNoise(noiseSVG);

// Export SVG
document.getElementById('exportButton').addEventListener('click', () => {
    const svgData = new XMLSerializer().serializeToString(noiseSVG);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'noise.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
