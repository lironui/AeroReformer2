const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuButton = $(".menu-button");
const navLinks = $(".nav-links");
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  navLinks.classList.toggle("open", expanded);
});
$$("a", navLinks).forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

function keyboardTabs(container) {
  const tabs = $$('[role="tab"]', container);
  container.addEventListener("keydown", event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
}
function selectTab(tabs, selected) {
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

const codeTabs = $$(".code-tab");
const copyButton = $(".copy-button");
codeTabs.forEach((tab, i) => {
  tab.id = `code-tab-${tab.dataset.code}`;
  tab.setAttribute("aria-controls", tab.dataset.code);
  tab.tabIndex = i ? -1 : 0;
  const block = document.getElementById(tab.dataset.code);
  block.setAttribute("role", "tabpanel");
  block.setAttribute("aria-labelledby", tab.id);
  block.hidden = i !== 0;
  tab.addEventListener("click", () => {
    selectTab(codeTabs, tab);
    $$(".code-block").forEach(block => {
      block.hidden = block.id !== tab.dataset.code;
      block.classList.toggle("active", !block.hidden);
    });
    copyButton.textContent = "Copy";
  });
});
copyButton.setAttribute("aria-live", "polite");
copyButton.addEventListener("click", async () => {
  const code = $(".code-block.active code")?.textContent;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Select code to copy";
  }
});

const figureTabs = $$(".result-tab");
figureTabs.forEach(tab => tab.addEventListener("click", () => {
  selectTab(figureTabs, tab);
  $$(".result-panel").forEach(panel => {
    panel.hidden = panel.id !== tab.dataset.result;
    panel.classList.toggle("active", !panel.hidden);
  });
}));

// The dialog can show composited examples as well as original paper figures.
const dialog = $(".result-dialog");
let dialogTrigger;
function openImage(content, title, trigger) {
  dialogTrigger = trigger;
  $(".dialog-media").replaceChildren(content);
  $("#dialog-title").textContent = title;
  dialog.showModal();
  document.body.classList.add("dialog-open");
}
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  dialogTrigger?.focus({ preventScroll: true });
});
$$(".result-zoom").forEach(button => button.addEventListener("click", () => {
  const img = $("img", button).cloneNode();
  img.loading = "eager";
  openImage(img, img.alt, button);
}));

const heroBase = "assets/examples/success-test_014110";
$$("[data-hero]").forEach(button => button.addEventListener("click", () => {
  $$("[data-hero]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  const mode = button.dataset.hero;
  const overlay = $("#hero-overlay");
  overlay.hidden = mode === "rgb";
  if (mode !== "rgb") overlay.src = `${heroBase}/${mode}-overlay.png`;
  $("#hero-score").textContent = { rgb: "Original RGB · VoiceAeroRef", gt: "Ground truth · annotated target", swin: "Swin-B · IoU 0.888" }[mode];
}));
$$("audio").forEach(player => player.addEventListener("play", () => {
  $$("audio").forEach(other => { if (other !== player) other.pause(); });
}));

const cases = window.PROJECT_CASES || [];
const groupTabs = $$("[data-group]");
const sceneSelect = $("#scene-select");
const grid = $("#comparison-grid");
let selectedCase;
let view = "overlay";
const labels = { rgb: "Input RGB", gt: "Ground truth", swin: "AeroReformer2 · Swin-B", resnet: "AeroReformer2 · ResNet-101", lscf: "LSCF · audio adapter" };

function image(src, alt, className, record) {
  const element = document.createElement("img");
  Object.assign(element, { src, alt, className, width: record.width, height: record.height });
  element.decoding = "async";
  return element;
}
function makeStack(record, model) {
  const stack = document.createElement("div");
  stack.className = "image-stack";
  stack.append(image(`${record.base}/rgb.webp`, `${record.title}: ${labels[model]}`, "rgb-layer", record));
  if (model !== "rgb") {
    stack.append(image(`${record.base}/${model}-overlay.png`, "", "mask-layer", record));
    stack.append(image(`${record.base}/${model}-mask.png`, `${labels[model]} binary mask`, "binary-layer", record));
  } else stack.classList.add("input-stack");
  return stack;
}
function displayCase(record) {
  selectedCase = record;
  $("#example-query").textContent = `“${record.phrase}”`;
  $("#speech-source").textContent = `${record.speech} · 16 kHz`;
  const player = $("#example-audio");
  player.pause();
  player.src = `${record.base}/query.wav`;
  player.load();
  $("#audio-download").href = player.src;
  $("#audio-download").download = `${record.id}.wav`;
  $("#case-note").textContent = `${record.id} · ${record.metric}`;
  grid.replaceChildren();
  Object.entries(labels).forEach(([model, label]) => {
    const figure = document.createElement("figure");
    figure.className = `comparison-tile model-${model}`;
    const caption = document.createElement("figcaption");
    const name = document.createElement("span");
    name.textContent = label;
    const score = document.createElement("strong");
    score.textContent = record.scores[model] !== undefined ? `IoU ${record.scores[model].toFixed(3)}` : model === "gt" ? "Reference mask" : "Original image";
    caption.append(name, score);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile-zoom";
    button.setAttribute("aria-label", `Enlarge ${label} for ${record.title}`);
    button.append(makeStack(record, model));
    button.addEventListener("click", () => {
      const stack = makeStack(record, model);
      stack.classList.toggle("mask-only", view === "mask");
      openImage(stack, `${record.title} · ${label} · ${score.textContent}`, button);
    });
    figure.append(caption, button);
    grid.append(figure);
  });
}
function selectGroup(group, initialId) {
  const tab = groupTabs.find(item => item.dataset.group === group);
  selectTab(groupTabs, tab);
  $("#example-content").setAttribute("aria-labelledby", tab.id);
  const rows = cases.filter(record => record.group === group);
  sceneSelect.replaceChildren(...rows.map(record => {
    const option = document.createElement("option");
    option.value = record.id;
    option.textContent = record.title;
    return option;
  }));
  const record = rows.find(record => record.id === initialId) || rows[0];
  if (record) { sceneSelect.value = record.id; displayCase(record); }
}
groupTabs.forEach(tab => tab.addEventListener("click", () => selectGroup(tab.dataset.group)));
sceneSelect.addEventListener("change", () => displayCase(cases.find(record => record.id === sceneSelect.value && record.group === selectedCase.group)));
$$("[data-view]").forEach(button => button.addEventListener("click", () => {
  view = button.dataset.view;
  $$("[data-view]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  grid.classList.toggle("mask-only", view === "mask");
}));
$$(".figure-jump").forEach(button => button.addEventListener("click", () => {
  $(".paper-comparisons").open = true;
  const tab = $(`#figure-tab-${button.dataset.figure}`);
  tab.click();
  tab.focus({ preventScroll: true });
  $(".paper-comparisons").scrollIntoView({ block: "start" });
}));
$$(".example-jump").forEach(button => button.addEventListener("click", () => {
  selectGroup(button.dataset.exampleGroup);
  groupTabs.find(tab => tab.dataset.group === button.dataset.exampleGroup).focus({ preventScroll: true });
  $("#example-explorer").scrollIntoView({ block: "start" });
}));
$$("[role='tablist']").forEach(keyboardTabs);
selectGroup("success", "test_014110");
