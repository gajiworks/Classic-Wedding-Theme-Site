(() => {
    "use strict";

    const galleryModal = document.querySelector("#gallery-modal");
    const galleryModalContent = galleryModal?.querySelector(".gallery-modal-content");
    const galleryModalImage = document.querySelector("#gallery-modal-image");

    const closeGallery = () => {
        if (!galleryModal) return;
        galleryModal.hidden = true;
        document.body.classList.remove("gallery-open");
        if (galleryModalImage) {
            galleryModalImage.src = "";
            galleryModalImage.alt = "";
        }
    };

    document.querySelectorAll("[data-gallery-src]").forEach(button => {
        button.addEventListener("click", () => {
            if (!galleryModal || !galleryModalImage) return;
            galleryModalImage.src = button.dataset.gallerySrc || "";
            galleryModalImage.alt = button.dataset.galleryAlt || "Wedding gallery photo";
            galleryModal.hidden = false;
            document.body.classList.add("gallery-open");
            galleryModal.querySelector(".gallery-modal-close")?.focus();
        });
    });

    galleryModal?.querySelector(".gallery-modal-close")?.addEventListener("click", closeGallery);
    galleryModal?.addEventListener("click", event => {
        if (event.target === galleryModal) closeGallery();
    });
    galleryModalContent?.addEventListener("click", event => event.stopPropagation());

    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach(item => item.classList.add("is-visible"));
    } else {
        document.documentElement.classList.add("motion-ready");
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
        revealItems.forEach(item => observer.observe(item));
    }

    const form = document.querySelector(".rsvp-form");
    const successModal = document.querySelector("#rsvp-success-modal");
    if (form && successModal) {
        const status = form.querySelector(".rsvp-form-status");
        const submitButton = form.querySelector("button[type='submit']");
        const submitLabel = submitButton?.dataset.submitLabel || "Yes, I’ll Be There";

        const setStatus = (type, message) => {
            if (!status) return;
            status.classList.remove("success", "error");
            if (type) status.classList.add(type);
            status.textContent = message || "";
        };

        const closeSuccess = () => {
            successModal.classList.remove("is-open");
            successModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("rsvp-modal-open");
        };

        const openSuccess = () => {
            successModal.classList.add("is-open");
            successModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("rsvp-modal-open");
            successModal.querySelector(".rsvp-success-close")?.focus();
        };

        successModal.querySelectorAll(".rsvp-success-close").forEach(button => button.addEventListener("click", closeSuccess));
        successModal.addEventListener("click", event => {
            if (event.target === successModal) closeSuccess();
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
                const response = await fetch(form.action, { method: form.method || "POST", headers: { Accept: "application/json" }, body: formData });
                const result = await response.json().catch(() => ({}));
                if (!response.ok || result.success === false) throw new Error(result.message || "The RSVP could not be sent.");
                form.reset();
                openSuccess();
            } catch (error) {
                console.error(error);
                setStatus("error", "Something went wrong. Please try again.");
            } finally {
                delete form.dataset.submitting;
                form.classList.remove("is-submitting");
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitLabel;
                }
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;
            if (!galleryModal?.hidden) closeGallery();
            if (successModal.classList.contains("is-open")) closeSuccess();
        });
    }
})();
