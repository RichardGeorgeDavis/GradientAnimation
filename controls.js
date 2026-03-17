(function () {
    const DEFAULT_NAV_LINKS = [{
        href: "index.html",
        label: "Index"
    }, {
        href: "index-2.html",
        label: "Index 2"
    }, {
        href: "index-3.html",
        label: "Index 3"
    }, {
        href: "index-4.html",
        label: "Index 4"
    }];

    function waitForGradientReady(gradient) {
        return new Promise(resolve => {
            const poll = () => {
                if (gradient && gradient.mesh && gradient.uniforms && Array.isArray(gradient.sectionColors)) {
                    resolve(gradient);
                    return;
                }
                window.requestAnimationFrame(poll)
            };
            poll()
        })
    }

    function formatNumber(value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return "";
        return numericValue.toFixed(Math.abs(numericValue) >= 1 ? 2 : 6).replace(/\.?0+$/, "")
    }

    function isCurrentPage(href) {
        return new URL(href, window.location.href).pathname === window.location.pathname
    }

    function createNavigationMarkup(links) {
        return links.map(link => {
            const currentPageAttributes = isCurrentPage(link.href) ? ' aria-current="page" class="gradient-admin__nav-link is-active"' : ' class="gradient-admin__nav-link"';
            return `<a href="${link.href}"${currentPageAttributes}>${link.label}</a>`
        }).join("")
    }

    function createColorFieldsMarkup(colors) {
        return colors.map((color, index) => `\n            <label class="gradient-admin__field gradient-admin__field--color">\n                <span class="gradient-admin__field-label">Color ${index + 1}</span>\n                <input type="color" data-color-index="${index}" value="${color}">\n                <code>${color}</code>\n            </label>\n        `).join("")
    }

    function updateOutput(output, value) {
        output && (output.textContent = formatNumber(value))
    }

    function syncColorLabels(panel) {
        panel.querySelectorAll("[data-color-index]").forEach(input => {
            input.nextElementSibling && (input.nextElementSibling.textContent = input.value)
        })
    }

    window.mountGradientControls = async function mountGradientControls(gradient, options = {}) {
        if (!gradient || document.querySelector(".gradient-admin")) return null;
        await waitForGradientReady(gradient);

        const initialState = JSON.parse(JSON.stringify(gradient.getState()));
        const navLinks = options.navLinks || DEFAULT_NAV_LINKS;
        const root = document.createElement("div");
        root.className = "gradient-admin";
        root.innerHTML = `
            <div class="gradient-admin__bar">
                <nav class="gradient-admin__nav" aria-label="Demo navigation">
                    ${createNavigationMarkup(navLinks)}
                </nav>
                <button type="button" class="gradient-admin__toggle" data-action="toggle-panel" aria-expanded="true">Hide controls</button>
            </div>
            <aside class="gradient-admin__panel" aria-label="Gradient controls">
                <div class="gradient-admin__panel-header">
                    <div>
                        <p class="gradient-admin__eyebrow">Debug / Admin</p>
                        <h1>Gradient Controls</h1>
                    </div>
                    <div class="gradient-admin__button-row">
                        <button type="button" data-action="play-toggle">${initialState.playing ? "Pause" : "Play"}</button>
                        <button type="button" data-action="reset">Reset</button>
                    </div>
                </div>

                <section class="gradient-admin__section">
                    <h2>Geometry</h2>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-heading">
                            <span class="gradient-admin__field-label">Amplitude</span>
                            <output data-output="amp">${formatNumber(initialState.amp)}</output>
                        </span>
                        <input type="range" data-field="amp" min="0" max="600" step="5" value="${initialState.amp}">
                    </label>
                    <label class="gradient-admin__field gradient-admin__field--checkbox">
                        <span class="gradient-admin__field-label">Wireframe</span>
                        <input type="checkbox" data-field="wireframe"${initialState.wireframe ? " checked" : ""}>
                    </label>
                </section>

                <section class="gradient-admin__section">
                    <h2>Motion</h2>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-label">Global frequency X</span>
                        <input type="number" data-field="freqX" min="0.00001" max="0.001" step="0.00001" value="${initialState.freqX}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-label">Global frequency Y</span>
                        <input type="number" data-field="freqY" min="0.00001" max="0.001" step="0.00001" value="${initialState.freqY}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-label">Time scale</span>
                        <input type="number" data-field="globalNoiseSpeed" min="0" max="0.00005" step="0.000001" value="${initialState.globalNoiseSpeed}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-label">Vertex noise X</span>
                        <input type="number" data-field="vertexNoiseFreqX" min="0" max="10" step="0.1" value="${initialState.vertexNoiseFreqX}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-label">Vertex noise Y</span>
                        <input type="number" data-field="vertexNoiseFreqY" min="0" max="10" step="0.1" value="${initialState.vertexNoiseFreqY}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-heading">
                            <span class="gradient-admin__field-label">Vertex speed</span>
                            <output data-output="vertexNoiseSpeed">${formatNumber(initialState.vertexNoiseSpeed)}</output>
                        </span>
                        <input type="range" data-field="vertexNoiseSpeed" min="0" max="25" step="0.1" value="${initialState.vertexNoiseSpeed}">
                    </label>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-heading">
                            <span class="gradient-admin__field-label">Vertex flow</span>
                            <output data-output="vertexNoiseFlow">${formatNumber(initialState.vertexNoiseFlow)}</output>
                        </span>
                        <input type="range" data-field="vertexNoiseFlow" min="0" max="10" step="0.1" value="${initialState.vertexNoiseFlow}">
                    </label>
                </section>

                <section class="gradient-admin__section">
                    <h2>Lighting</h2>
                    <label class="gradient-admin__field">
                        <span class="gradient-admin__field-heading">
                            <span class="gradient-admin__field-label">Shadow power</span>
                            <output data-output="shadowPower">${formatNumber(initialState.shadowPower)}</output>
                        </span>
                        <input type="range" data-field="shadowPower" min="0" max="20" step="0.5" value="${initialState.shadowPower}">
                    </label>
                    <label class="gradient-admin__field gradient-admin__field--checkbox">
                        <span class="gradient-admin__field-label">Darken top</span>
                        <input type="checkbox" data-field="darkenTop"${initialState.darkenTop ? " checked" : ""}>
                    </label>
                </section>

                <section class="gradient-admin__section">
                    <h2>Colors</h2>
                    ${createColorFieldsMarkup(initialState.colors)}
                </section>
            </aside>
        `;

        document.body.appendChild(root);

        const panel = root.querySelector(".gradient-admin__panel");
        const togglePanelButton = root.querySelector('[data-action="toggle-panel"]');
        const playToggleButton = root.querySelector('[data-action="play-toggle"]');
        const resetButton = root.querySelector('[data-action="reset"]');
        const inputs = {
            amp: root.querySelector('[data-field="amp"]'),
            darkenTop: root.querySelector('[data-field="darkenTop"]'),
            freqX: root.querySelector('[data-field="freqX"]'),
            freqY: root.querySelector('[data-field="freqY"]'),
            globalNoiseSpeed: root.querySelector('[data-field="globalNoiseSpeed"]'),
            shadowPower: root.querySelector('[data-field="shadowPower"]'),
            vertexNoiseFlow: root.querySelector('[data-field="vertexNoiseFlow"]'),
            vertexNoiseFreqX: root.querySelector('[data-field="vertexNoiseFreqX"]'),
            vertexNoiseFreqY: root.querySelector('[data-field="vertexNoiseFreqY"]'),
            vertexNoiseSpeed: root.querySelector('[data-field="vertexNoiseSpeed"]'),
            wireframe: root.querySelector('[data-field="wireframe"]')
        };
        const outputs = {
            amp: root.querySelector('[data-output="amp"]'),
            shadowPower: root.querySelector('[data-output="shadowPower"]'),
            vertexNoiseFlow: root.querySelector('[data-output="vertexNoiseFlow"]'),
            vertexNoiseSpeed: root.querySelector('[data-output="vertexNoiseSpeed"]')
        };

        function syncFields(state) {
            inputs.amp.value = state.amp;
            inputs.darkenTop.checked = state.darkenTop;
            inputs.freqX.value = state.freqX;
            inputs.freqY.value = state.freqY;
            inputs.globalNoiseSpeed.value = state.globalNoiseSpeed;
            inputs.shadowPower.value = state.shadowPower;
            inputs.vertexNoiseFlow.value = state.vertexNoiseFlow;
            inputs.vertexNoiseFreqX.value = state.vertexNoiseFreqX;
            inputs.vertexNoiseFreqY.value = state.vertexNoiseFreqY;
            inputs.vertexNoiseSpeed.value = state.vertexNoiseSpeed;
            inputs.wireframe.checked = state.wireframe;
            updateOutput(outputs.amp, state.amp);
            updateOutput(outputs.shadowPower, state.shadowPower);
            updateOutput(outputs.vertexNoiseFlow, state.vertexNoiseFlow);
            updateOutput(outputs.vertexNoiseSpeed, state.vertexNoiseSpeed);
            playToggleButton.textContent = state.playing ? "Pause" : "Play";
            state.colors.forEach((color, index) => {
                const input = panel.querySelector(`[data-color-index="${index}"]`);
                input && (input.value = color)
            });
            syncColorLabels(panel)
        }

        togglePanelButton.addEventListener("click", () => {
            const isCollapsed = root.classList.toggle("is-collapsed");
            togglePanelButton.textContent = isCollapsed ? "Show controls" : "Hide controls";
            togglePanelButton.setAttribute("aria-expanded", String(!isCollapsed))
        });

        playToggleButton.addEventListener("click", () => {
            gradient.setPlaying(!gradient.getState().playing);
            syncFields(gradient.getState())
        });

        resetButton.addEventListener("click", () => {
            gradient.applyState(initialState);
            syncFields(gradient.getState())
        });

        inputs.amp.addEventListener("input", () => {
            gradient.setAmplitude(inputs.amp.value);
            updateOutput(outputs.amp, inputs.amp.value)
        });
        inputs.wireframe.addEventListener("change", () => gradient.setWireframe(inputs.wireframe.checked));
        inputs.darkenTop.addEventListener("change", () => gradient.setDarkenTop(inputs.darkenTop.checked));
        inputs.freqX.addEventListener("input", () => gradient.setGlobalNoiseFrequency(inputs.freqX.value, inputs.freqY.value));
        inputs.freqY.addEventListener("input", () => gradient.setGlobalNoiseFrequency(inputs.freqX.value, inputs.freqY.value));
        inputs.globalNoiseSpeed.addEventListener("input", () => gradient.setGlobalNoiseSpeed(inputs.globalNoiseSpeed.value));
        inputs.vertexNoiseFreqX.addEventListener("input", () => gradient.setVertexNoiseFrequency(inputs.vertexNoiseFreqX.value, inputs.vertexNoiseFreqY.value));
        inputs.vertexNoiseFreqY.addEventListener("input", () => gradient.setVertexNoiseFrequency(inputs.vertexNoiseFreqX.value, inputs.vertexNoiseFreqY.value));
        inputs.vertexNoiseSpeed.addEventListener("input", () => {
            gradient.setVertexNoiseSpeed(inputs.vertexNoiseSpeed.value);
            updateOutput(outputs.vertexNoiseSpeed, inputs.vertexNoiseSpeed.value)
        });
        inputs.vertexNoiseFlow.addEventListener("input", () => {
            gradient.setVertexNoiseFlow(inputs.vertexNoiseFlow.value);
            updateOutput(outputs.vertexNoiseFlow, inputs.vertexNoiseFlow.value)
        });
        inputs.shadowPower.addEventListener("input", () => {
            gradient.setShadowPower(inputs.shadowPower.value);
            updateOutput(outputs.shadowPower, inputs.shadowPower.value)
        });
        panel.querySelectorAll("[data-color-index]").forEach(input => {
            input.addEventListener("input", () => {
                gradient.setColor(Number.parseInt(input.dataset.colorIndex, 10), input.value);
                syncColorLabels(panel)
            })
        });

        syncFields(gradient.getState());
        return root
    };
}());
