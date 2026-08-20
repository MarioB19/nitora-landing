"use client";

import { useEffect, useState } from "react";

export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const contact = document.getElementById("solicitar");
      const contactIsNear = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.72
        : false;
      setVisible(window.scrollY > Math.min(620, window.innerHeight * 0.82) && !contactIsNear);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      className={`mobile-cta${visible ? " is-visible" : ""}`}
      data-cta="mobile-sticky"
      href="#solicitar"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      Solicitar evaluación <span aria-hidden="true">→</span>
    </a>
  );
}
