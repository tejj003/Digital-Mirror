let video;
let lineSpacing = 4;
let squiggleStrength = 3;
let lineWeight = 1;

let lineSpacingSlider, squiggleSlider, weightSlider;
let layoutDiv, canvasParent, guiDiv, controllersDiv, minimizeBtn;
let strokeColor = '#FFFFFF';
let bgColor = '#000000';
let accentColor = '#b91c1c';

function setup() {
    // Layout container with custom class
    layoutDiv = createDiv();
    layoutDiv.class('layout-container');
    // Keep layout container transparent so artwork can be full-screen underneath
    layoutDiv.style('background-color', 'transparent');
    layoutDiv.style('border-radius', '1rem'); // rounded-2xl
    layoutDiv.style('box-shadow', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'); // shadow-2xl

    // Canvas container
    canvasParent = createDiv();
    canvasParent.parent(layoutDiv);
    canvasParent.class('p5-canvas-container'); // your existing CSS class for canvas styling

    // Create a full-window canvas so artwork is end-to-end
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent(canvasParent);
    cnv.style('display', 'block');

    // Webcam setup
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    frameRate(10);
    noFill();

    // GUI container on right
    guiDiv = createDiv();
    guiDiv.parent(layoutDiv);
    guiDiv.class('gui-container');

    // Controllers panel in the top-right corner (will hold sliders)
    controllersDiv = createDiv();
    controllersDiv.class('controllers-top');
    // ensure it's attached to the document body so fixed positioning works relative to viewport
    controllersDiv.parent(select('body'));

    // Minimize button for controllers
    minimizeBtn = createButton('\u2212');
    minimizeBtn.class('minimize-btn');
    minimizeBtn.parent(controllersDiv);
    // ensure single-line CTA and accessibility
    minimizeBtn.style('white-space', 'nowrap');
    minimizeBtn.attribute('role', 'button');
    minimizeBtn.attribute('aria-expanded', 'true');
        // Clicking behavior:
        // - when expanded: clicking minimizes
        // - when minimized: clicking opens registration; Shift+click restores
        // Toggle controllers when the minimize/CTA button is clicked.
        // When minimized, clicking restores the sliders; when expanded, it minimizes.
        minimizeBtn.mousePressed(() => {
            toggleControllers();
        });

    // Label styles
    const labelClass = 'slider-label';

    // --- Color controls ---
    const palettes = [
        { name: 'Noir', bg: '#000000', stroke: '#FFFFFF', accent: '#E11D48' },
        { name: 'Carbon', bg: '#0B0F12', stroke: '#F8F8F8', accent: '#FF6B35' },
        { name: 'Crimson', bg: '#100000', stroke: '#FFEFEF', accent: '#DC2626' },
        { name: 'Rosso', bg: '#080204', stroke: '#FFF7F6', accent: '#FF2D2D' },
        { name: 'Fire', bg: '#0F0300', stroke: '#FFF4EE', accent: '#FF6B2D' },
        { name: 'Minimal', bg: '#000000', stroke: '#FFFFFF', accent: '#b91c1c' },
        { name: 'Burgundy', bg: '#12060A', stroke: '#F7EAEA', accent: '#9B1C3A' },
        { name: 'Neon', bg: '#050505', stroke: '#00FFE1', accent: '#FFD400' }
    ];

    let colorLabel = createP('Colors');
    colorLabel.class(labelClass);
    colorLabel.parent(controllersDiv);

    // swatch container
    let swatchRow = createDiv();
    swatchRow.parent(controllersDiv);
    swatchRow.style('display', 'flex');
    swatchRow.style('gap', '8px');

    palettes.forEach(p => {
        let b = createButton('');
        b.class('swatch');
        b.parent(swatchRow);
        // show both stroke and accent in a small two-tone preview
        b.style('background', `linear-gradient(90deg, ${p.stroke} 50%, ${p.accent} 50%)`);
        b.attribute('data-bg', p.bg);
        b.attribute('data-stroke', p.stroke);
        b.attribute('data-accent', p.accent);
        b.attribute('title', p.name);
        b.mousePressed(() => {
            bgColor = p.bg;
            strokeColor = p.stroke;
            accentColor = p.accent;
            saveColors();
            // update color pickers if they exist in the DOM
            try {
                const sEl = document.getElementById('strokeColorInput');
                const bEl = document.getElementById('bgColorInput');
                if (sEl) sEl.value = strokeColor;
                if (bEl) bEl.value = bgColor;
            } catch (e) {}
        });
    });

    // Custom color pickers
    let customStrokeLabel = createP('Custom stroke');
    customStrokeLabel.class(labelClass);
    customStrokeLabel.parent(controllersDiv);
    let strokeInput = createColorPicker(strokeColor);
    strokeInput.parent(controllersDiv);
    strokeInput.input(() => { strokeColor = strokeInput.value(); saveColors(); });
    strokeInput.attribute('id', 'strokeColorInput');

    let customBgLabel = createP('Custom background');
    customBgLabel.class(labelClass);
    customBgLabel.parent(controllersDiv);
    let bgInput = createColorPicker(bgColor);
    bgInput.parent(controllersDiv);
    bgInput.input(() => { bgColor = bgInput.value(); saveColors(); });
    bgInput.attribute('id', 'bgColorInput');

    // load persisted colors
    loadColors();

    // update color pickers to reflect loaded values
    strokeInput.value(strokeColor);
    bgInput.value(bgColor);

    // accessibility/title for minimize button
    minimizeBtn.attribute('aria-expanded', 'true');
    minimizeBtn.attribute('title', 'Click to minimize');

    // Line Density Slider (spacing between lines)
    let lineSpacingLabel = createP('Line Density');
    lineSpacingLabel.class(labelClass);
    lineSpacingLabel.parent(controllersDiv);

    lineSpacingSlider = createSlider(1, 20, lineSpacing, 1);
    lineSpacingSlider.class('slider-full-width');
    lineSpacingSlider.parent(controllersDiv);
    // helper text and accessibility
    let lineHelp = createP('Spacing between horizontal lines — lower = denser');
    lineHelp.class('slider-help');
    lineHelp.parent(controllersDiv);
    lineSpacingSlider.attribute('title', 'Line Density — spacing between lines in pixels');
    lineSpacingSlider.attribute('aria-label', 'Line Density slider');

    // Organic Distortion Slider
    let squiggleLabel = createP('Organic Distortion');
    squiggleLabel.class(labelClass);
    squiggleLabel.parent(controllersDiv);

    squiggleSlider = createSlider(0, 10, squiggleStrength, 0.1);
    squiggleSlider.class('slider-full-width');
    squiggleSlider.parent(controllersDiv);
    let squiggleHelp = createP('Noise-driven wobble applied to lines — higher = more movement');
    squiggleHelp.class('slider-help');
    squiggleHelp.parent(controllersDiv);
    squiggleSlider.attribute('title', 'Organic Distortion — noise amplitude');
    squiggleSlider.attribute('aria-label', 'Organic Distortion slider');

    // Stroke Weight Slider
    let weightLabel = createP('Stroke Weight');
    weightLabel.class(labelClass);
    weightLabel.parent(controllersDiv);

    weightSlider = createSlider(0.5, 5, lineWeight, 0.1);
    weightSlider.class('slider-full-width');
    weightSlider.parent(controllersDiv);
    let weightHelp = createP('Thickness of the drawn lines');
    weightHelp.class('slider-help');
    weightHelp.parent(controllersDiv);
    weightSlider.attribute('title', 'Stroke Weight — line thickness');
    weightSlider.attribute('aria-label', 'Stroke Weight slider');

    // Small register strip (styled rectangle with call-to-action)
    let registerStrip = createDiv('Register now for hackathon');
    registerStrip.parent(controllersDiv); // place the CTA in the visible controllers panel
    registerStrip.class('register-strip');
    // Optional: clickable placeholder (opens a new tab to a placeholder URL)
    registerStrip.mousePressed(() => {
        try {
            window.open('#', '_blank');
        } catch (e) {
            /* noop in environments where window isn't available */
        }
    });
}

function draw() {
    // apply user colors
    background(bgColor);
    stroke(strokeColor);

    video.loadPixels();

    lineSpacing = lineSpacingSlider.value();
    squiggleStrength = squiggleSlider.value();
    lineWeight = weightSlider.value();
    strokeWeight(lineWeight);

    const numLines = int(height / lineSpacing);

    for (let i = 0; i < numLines; i++) {
        const yBase = i * lineSpacing;
        drawSquigglyLine(yBase, i);
    }
}

function saveColors() {
    try {
        localStorage.setItem('art_bg', bgColor);
        localStorage.setItem('art_stroke', strokeColor);
        localStorage.setItem('art_accent', accentColor);
    } catch (e) {}
}

function loadColors() {
    try {
        const b = localStorage.getItem('art_bg');
        const s = localStorage.getItem('art_stroke');
        const a = localStorage.getItem('art_accent');
        if (b) bgColor = b;
        if (s) strokeColor = s;
        if (a) accentColor = a;
    } catch (e) {}
}

function windowResized() {
    // Make canvas responsive to window changes
    resizeCanvas(windowWidth, windowHeight);
    if (video) {
        video.size(width, height);
    }
}

function toggleControllers() {
    if (!controllersDiv) return;
    // Use a single minimized-cta class for the compact CTA state.
    const isMinCta = controllersDiv.hasClass('minimized-cta');
    if (isMinCta) {
        // restore
        controllersDiv.removeClass('minimized-cta');
    minimizeBtn.html('\u2212');
    minimizeBtn.attribute('title', 'Click to minimize');
    minimizeBtn.attribute('aria-expanded', 'true');
    // restore visual styling to transparent/white
    minimizeBtn.style('background-color', 'transparent');
    minimizeBtn.style('color', '#ffffff');
    minimizeBtn.style('border', 'none');
    } else {
        // minimize to CTA
        controllersDiv.addClass('minimized-cta');
    minimizeBtn.html('Register for hackathon');
    minimizeBtn.attribute('title', 'Click to restore sliders');
    minimizeBtn.attribute('aria-expanded', 'false');
    // apply clear CTA styling inline so it doesn't depend on stylesheet ordering
    minimizeBtn.style('background-color', '#ffffff');
    minimizeBtn.style('color', '#7f1d1d');
    }
}

function drawSquigglyLine(yBase, lineIndex) {
    beginShape();
    for (let x = 0; x <= width; x += 2) {
        const mirrorX = video.width - x - 1;
        const imgX = constrain(mirrorX, 0, video.width - 1);
        const imgY = constrain(yBase, 0, video.height - 1);

        const index = (imgY * video.width + imgX) * 4;
        const r = video.pixels[index];
        const g = video.pixels[index + 1];
        const b = video.pixels[index + 2];
        const bright = (r + g + b) / 3;

        let y = yBase + map(bright, 0, 255, -15, 15);

        let n = noise(x * 0.05, lineIndex * 0.1, frameCount * 0.05);
        let squiggle = map(n, 0, 1, -squiggleStrength, squiggleStrength);
        y += squiggle;

        vertex(x, y);
    }
    endShape();
}
