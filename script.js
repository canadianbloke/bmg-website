// Plan data in one place, so prices and specs stay consistent everywhere.
const PLANS = [
  {
    id: "ingot", name: "Ingot", for: "2–4 co-op players",
    desc: "Entry point for small groups running one active server.",
    cpu: 4, ram: 8, slots: 3,
    tiers: {
      al: { storage: "160 GB HDD", gbp: 30, eur: 35 },
      st: { storage: "128 GB SSD", gbp: 37, eur: 45 },
      ti: { storage: "128 GB NVMe", gbp: 46, eur: 55 },
    },
  },
  {
    id: "anvil", name: "Anvil", for: "8+ players", featured: "Most popular",
    desc: "Runs most modern titles, or several lighter servers at once.",
    cpu: 8, ram: 16, slots: 6,
    tiers: {
      al: { storage: "320 GB HDD", gbp: 45, eur: 54 },
      st: { storage: "256 GB SSD", gbp: 61, eur: 73 },
      ti: { storage: "256 GB NVMe", gbp: 78, eur: 94 },
    },
  },
  {
    id: "crucible", name: "Crucible", for: "Growing communities",
    desc: "Heavy persistent worlds like Conan Exiles or Enshrouded.",
    cpu: 12, ram: 32, slots: 12,
    tiers: {
      al: { storage: "640 GB HDD", gbp: 72, eur: 86, note: "Best value" },
      st: { storage: "512 GB SSD", gbp: 95, eur: 113 },
      ti: { storage: "1 TB NVMe", gbp: 135, eur: 162 },
    },
  },
  {
    id: "forge", name: "Forge", for: "Large communities",
    desc: "Flagship. Several heavy servers side by side.",
    cpu: 16, ram: 64, slots: 24,
    tiers: {
      st: { storage: "1 TB SSD", gbp: 139, eur: 167 },
      ti: { storage: "1 TB NVMe", gbp: 239, eur: 287 },
    },
  },
];

const TIER_NOTES = {
  al: "Aluminium: HDD storage (~100 MB/s, up to 4 TB), hosted in Germany.",
  st: "Steel: SSD storage (400+ MB/s, up to 8 TB), global locations available.",
  ti: "Titanium: NVMe storage (1000+ MB/s, up to 8 TB), global locations and dedicated vCPU cores.",
};

const FINDER = {
  ingot: "Ingot fits small co-op groups: 8 GB RAM and 3 server slots.",
  anvil: "Anvil is our most popular choice: 16 GB RAM and 6 slots for most modern games.",
  crucible: "Crucible handles heavy persistent worlds: 32 GB RAM and 12 slots.",
  forge: "Forge is built for big communities running many servers: 64 GB RAM and 24 slots.",
};

// Managed Service add-on price per month. Change these to your real fee.
const MANAGED_PRICE = { gbp: 10, eur: 12 };

const state = { tier: "st", cur: "gbp", match: "ingot" };
const sym = { gbp: "£", eur: "€" };
const cardsEl = document.getElementById("cards");

function render() {
  cardsEl.innerHTML = PLANS.map((p) => {
    const t = p.tiers[state.tier];
    const classes = ["card", p.featured && "featured", state.match === p.id && "match", !t && "unavailable"].filter(Boolean).join(" ");
    const badge = p.featured || t?.note;
    return `
      <article class="${classes}" id="plan-${p.id}">
        ${badge ? `<span class="badge">${badge}</span>` : ""}
        <h3>${p.name}</h3>
        <p class="for">${p.for}</p>
        <div class="price">${t ? `${sym[state.cur]}${t[state.cur]}<span> /month</span>` : `<span>Not offered on this tier</span>`}</div>
        <ul class="specs">
          <li><span>vCPU cores</span><span>${p.cpu}${state.tier === "ti" ? " dedicated" : " shared"}</span></li>
          <li><span>RAM</span><span>${p.ram} GB + 16 GB swap</span></li>
          <li><span>Storage</span><span>${t ? t.storage : "—"}</span></li>
          <li><span>Server slots</span><span>${p.slots}</span></li>
          <li><span>Backups &amp; patching</span><span>✓</span></li>
        </ul>
        <p class="desc">${p.desc}</p>
        ${t
          ? `<a class="btn ${p.featured ? "btn-primary" : "btn-ghost"}" href="https://my.baremetalgaming.com/">Deploy ${p.name}</a>`
          : `<button class="btn btn-ghost" data-switch="st">View Steel</button>`}
      </article>`;
  }).join("");
  document.getElementById("managedPrice").innerHTML =
    `<span>+</span>${sym[state.cur]}${MANAGED_PRICE[state.cur]}<span> /month per server</span>`;
  document.getElementById("tierNote").textContent = TIER_NOTES[state.tier];
  document.querySelector(".finder-result").innerHTML =
    FINDER[state.match].replace(/^(\w+)/, "<strong>$1</strong>") + ` <a href="#plan-${state.match}">See plan →</a>`;
}

function bindSeg(selector, key, attr) {
  document.querySelectorAll(`${selector} button`).forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(`${selector} button`).forEach((b) => b.classList.toggle("active", b === btn));
      state[key] = btn.dataset[attr];
      render();
    })
  );
}
bindSeg("#tierSeg", "tier", "tier");
bindSeg("#curSeg", "cur", "cur");
bindSeg(".finder .seg", "match", "plan");

cardsEl.addEventListener("click", (e) => {
  const sw = e.target.closest("[data-switch]");
  if (sw) document.querySelector(`#tierSeg button[data-tier="${sw.dataset.switch}"]`).click();
});

// "Ask about Managed Service" pre-fills the advice form
document.querySelector("[data-managed]").addEventListener("click", () => {
  const box = document.querySelector('#adviceForm textarea[name="details"]');
  if (!box.value.includes("Managed Service")) box.value = "I'm interested in the Managed Service add-on. " + box.value;
  setTimeout(() => box.focus({ preventScroll: true }), 400);
});

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const links = document.querySelector(".links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => { if (e.target.tagName === "A") links.classList.remove("open"); });

// Advice form (demo only: not wired to a backend yet)
document.getElementById("adviceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.querySelector(".form-msg").textContent = "Thanks! An engineer will get back to you shortly. (Demo: not connected to a backend yet.)";
  e.target.reset();
});

render();
