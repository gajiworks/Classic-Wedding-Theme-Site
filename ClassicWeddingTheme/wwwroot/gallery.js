window.weddingGallery = {
    component: null,

    open(component) {
        this.component = component;
        document.body.classList.add("gallery-open");
        document.addEventListener("keydown", this.handleKeydown);
    },

    close() {
        document.body.classList.remove("gallery-open");
        document.removeEventListener("keydown", this.handleKeydown);
        this.component = null;
    },

    handleKeydown(event) {
        if (event.key === "Escape" && window.weddingGallery.component) {
            window.weddingGallery.component.invokeMethodAsync("CloseGalleryFromEscape");
        }
    }
};

window.weddingMotion = {
    init() {
        const items = document.querySelectorAll("[data-reveal]");

        if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            items.forEach(item => item.classList.add("is-visible"));
            return;
        }

        document.documentElement.classList.add("motion-ready");

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

        items.forEach(item => observer.observe(item));
    }
};

window.weddingRsvp = {
    initialized: false,

    init() {
        if (this.initialized) return;

        const form = document.querySelector(".rsvp-form");
        const modal = document.querySelector("#rsvp-success-modal");
        if (!form || !modal) return;

        this.initialized = true;

        const status = form.querySelector(".rsvp-form-status");
        const submitButton = form.querySelector("button[type='submit']");
        const submitLabel = submitButton?.dataset.submitLabel || "Yes, I’ll Be There";

        const setStatus = (type, message) => {
            if (!status) return;
            status.classList.remove("success", "error");
            if (type) status.classList.add(type);
            status.textContent = message || "";
        };

        const openModal = () => {
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("rsvp-modal-open");
            modal.querySelector(".rsvp-success-close")?.focus();
        };

        const closeModal = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("rsvp-modal-open");
        };

        modal.querySelectorAll(".rsvp-success-close").forEach(button => {
            button.addEventListener("click", closeModal);
        });

        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });

        form.addEventListener("submit", async event => {
            event.preventDefault();
            if (form.dataset.submitting === "true") return;

            setStatus("", "");

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            if (String(formData.get("honeypot") || "").trim()) {
                form.reset();
                return;
            }

            form.dataset.submitting = "true";
            form.classList.add("is-submitting");
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {
                const response = await fetch(form.action, {
                    method: form.method || "POST",
                    headers: { "Accept": "application/json" },
                    body: formData
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "The RSVP could not be sent.");
                }

                form.reset();
                delete form.dataset.submitting;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitLabel;
                }
                openModal();
            } catch (error) {
                console.error(error);
                setStatus("error", "Something went wrong. Please try again.");
                delete form.dataset.submitting;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitLabel;
                }
            } finally {
                form.classList.remove("is-submitting");
            }
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.weddingRsvp.init(), { once: true });
} else {
    window.weddingRsvp.init();
}
