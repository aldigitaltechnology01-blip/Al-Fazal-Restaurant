const WEBHOOK_URL = "https://abdullahagent11.app.n8n.cloud/webhook/al-fazal-chat";

const nav = document.getElementById("nav");
const toggle = document.getElementById("menuToggle");
const chatPanel = document.getElementById("chatPanel");
const messages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatText");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const topBtn = document.getElementById("topBtn");

const contactForm = document.getElementById("whatsappContactForm");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !phone || !message) return;
  const text = `Assalam-o-Alaikum Al Fazal Family Restaurant!\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
  const whatsappUrl = `https://wa.me/923006594407?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});


if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }));
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

let sessionId;
try { sessionId = window.crypto?.randomUUID?.() || `af-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
catch { sessionId = `af-${Date.now()}`; }
let busy = false;

function openChat() {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  chatPanel?.classList.add("open");
  chatPanel?.setAttribute("aria-hidden", "false");
  window.setTimeout(() => chatInput?.focus(), 120);
}
function closeChat() {
  chatPanel?.classList.remove("open");
  chatPanel?.setAttribute("aria-hidden", "true");
}
document.querySelectorAll("[data-open-chat]").forEach(button => button.addEventListener("click", openChat));
document.getElementById("closeChat")?.addEventListener("click", closeChat);

function addBubble(text, who = "bot", extra = "") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${who} ${extra}`.trim();
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

async function sendMessage(rawText) {
  const text = String(rawText || "").trim();
  if (!text || busy) return;
  addBubble(text, "user");
  busy = true;
  chatInput.disabled = true;
  const pending = addBubble("One moment, please…", "bot");
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ message: text, sessionId })
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`Assistant returned ${response.status}`);
    let data;
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { output: raw }; }
    pending.remove();
    let reply = data.output ?? data.reply ?? data.response ?? data.text ?? data.message;
    if (Array.isArray(reply)) reply = reply.map(part => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    if (reply && typeof reply === "object") reply = JSON.stringify(reply, null, 2);
    addBubble(String(reply || "I received your message. Please share the items you would like to order."), "bot");
  } catch (error) {
    pending.remove();
    const fallback = addBubble("Sorry, I can’t reach the ordering assistant right now. You can still place your order directly on WhatsApp.", "bot", "error");
    const direct = document.createElement("a");
    direct.href = "https://wa.me/923006594407?text=" + encodeURIComponent("Assalam-o-Alaikum, I would like to place an order.");
    direct.target = "_blank"; direct.rel = "noopener"; direct.textContent = "Order on WhatsApp"; direct.className = "chat-direct-link";
    fallback.appendChild(document.createElement("br")); fallback.appendChild(direct);
    console.error("Al Fazal n8n chat error:", error);
  } finally {
    busy = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}

document.getElementById("chatForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const value = chatInput.value;
  if (!value.trim() || busy) return;
  chatInput.value = "";
  sendMessage(value);
});
document.querySelectorAll(".quick-prompts button").forEach(button => button.addEventListener("click", () => sendMessage(button.textContent)));

function openLightbox(button) {
  const source = button.dataset.image;
  if (!source) return;
  lightboxImg.src = source;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.getElementById("lightboxClose")?.focus();
}
document.querySelectorAll("[data-image]").forEach(button => button.addEventListener("click", () => openLightbox(button)));
function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.removeAttribute("src");
}
document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeChat(); closeLightbox(); }
});
window.addEventListener("scroll", () => {
  if (topBtn) topBtn.style.display = window.scrollY > 450 ? "block" : "none";
}, { passive: true });
topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const targets = document.querySelectorAll(".intro-copy,.intro-mark,.menu-page,.deal-copy,.deal-image,.order-card,.order-side,.contact-copy,.location-card");
  targets.forEach(element => element.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  targets.forEach(element => observer.observe(element));
}

// Single-page navigation: keep the active nav item in sync with the visible section.
const spaSections = ['home','menu','about','contact'].map(id => document.getElementById(id)).filter(Boolean);
const spaNavLinks = [...document.querySelectorAll('#nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        spaNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
  spaSections.forEach(section => navObserver.observe(section));
}
spaNavLinks.forEach(link => link.addEventListener('click', () => {
  nav?.classList.remove('open'); toggle?.setAttribute('aria-expanded','false');
}));
