"use client";

import { useMemo, useState } from "react";

const WEEKS_PER_MONTH = 4.33;

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

type ScenarioFieldProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
};

function ScenarioField({
  label,
  hint,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: ScenarioFieldProps) {
  const id = `scenario-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function update(rawValue: string) {
    const next = Number(rawValue);
    if (Number.isNaN(next)) return;
    onChange(Math.min(max, Math.max(min, next)));
  }

  return (
    <div className="scenario-field">
      <div className="scenario-field-head">
        <label htmlFor={id}>{label}</label>
        <div className="scenario-value">
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => update(event.currentTarget.value)}
          />
          <span>{suffix}</span>
        </div>
      </div>
      <input
        className="scenario-range"
        aria-label={`${label}: ${value} ${suffix}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => update(event.currentTarget.value)}
      />
      <small>{hint}</small>
    </div>
  );
}

export function ImpactCalculator() {
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [people, setPeople] = useState(2);
  const [hourlyCost, setHourlyCost] = useState(220);

  const result = useMemo(() => {
    const monthlyHours = weeklyHours * people * WEEKS_PER_MONTH;
    const monthlyCost = monthlyHours * hourlyCost;

    return {
      monthlyHours,
      monthlyCost,
      annualCost: monthlyCost * 12,
    };
  }, [weeklyHours, people, hourlyCost]);

  return (
    <section className="impact-section sec" id="calcular">
      <div className="shell impact-shell">
        <div className="impact-copy">
          <p className="eyebrow"><span /> Módulo de negocio · escenario editable</p>
          <h2>Haz visible el costo de preparar la información.</h2>
          <p className="lead-copy">
            Antes de hablar de automatización o margen recuperado, conviene medir la carga que sí
            puedes observar hoy: personas, horas y costo completo de preparar reportes.
          </p>
          <div className="impact-principle">
            <strong>Esto no calcula ahorro.</strong>
            <span>Calcula la base que Margen Uno tendría que comprobar y desglosar.</span>
          </div>
        </div>

        <div className="impact-module" aria-label="Calculadora de carga operativa">
          <div className="impact-module-head">
            <div>
              <span>ESCENARIO HIPOTÉTICO</span>
              <strong>Carga de reportería</strong>
            </div>
            <small>Edita los tres supuestos</small>
          </div>

          <div className="scenario-fields">
            <ScenarioField
              label="Horas por semana"
              hint="Por persona, sólo para preparar y conciliar reportes."
              value={weeklyHours}
              min={1}
              max={40}
              step={0.5}
              suffix="h"
              onChange={setWeeklyHours}
            />
            <ScenarioField
              label="Personas involucradas"
              hint="Incluye a quien extrae, revisa o corrige la información."
              value={people}
              min={1}
              max={12}
              step={1}
              suffix="pers."
              onChange={setPeople}
            />
            <ScenarioField
              label="Costo completo por hora"
              hint="Sueldo, prestaciones y costo operativo aproximado."
              value={hourlyCost}
              min={80}
              max={1200}
              step={10}
              suffix="MXN"
              onChange={setHourlyCost}
            />
          </div>

          <div className="impact-results" aria-live="polite">
            <div>
              <small>CARGA MENSUAL VISIBLE</small>
              <strong>{number.format(result.monthlyHours)} h</strong>
              <span>{weeklyHours} h × {people} pers. × 4.33 semanas</span>
            </div>
            <div className="impact-result-primary">
              <small>COSTO MENSUAL VISIBLE</small>
              <strong>{money.format(result.monthlyCost)}</strong>
              <span>Carga mensual × {money.format(hourlyCost)} por hora</span>
            </div>
            <div>
              <small>REFERENCIA ANUAL</small>
              <strong>{money.format(result.annualCost)}</strong>
              <span>Si el proceso se repite durante 12 meses</span>
            </div>
          </div>

          <details className="impact-formula">
            <summary>Ver fórmula y límites</summary>
            <p>
              Carga mensual = horas semanales × personas × 4.33. Costo mensual = carga mensual ×
              costo completo por hora. No incluye comisiones OTA, promociones, cancelaciones ni
              ingresos potenciales; esos valores requieren archivos reales y supuestos trazables.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
