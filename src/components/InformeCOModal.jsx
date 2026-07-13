import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eraser,
  FileText,
  Gauge,
  Mail,
  PenLine,
  Printer,
  Save,
  ShieldAlert,
  X,
} from "lucide-react";

const COPY = {
  es: {
    title: "Informe de inspección de monóxido de carbono",
    report: "Informe",
    date: "Fecha",
    customer: "Cliente",
    address: "Dirección",
    technician: "Técnico",
    equipment: "Equipo inspeccionado",
    model: "Modelo / número de serie",
    measurements: "Mediciones de CO",
    ambient: "Ambiente",
    equipmentArea: "Área del equipo",
    vent: "Ventilación / escape",
    other: "Otros",
    description: "Descripción",
    value: "Valor",
    alarm: "La alarma o detector de CO se activó",
    visual: "Se realizó una inspección visual",
    findings: "Hallazgos",
    recommendations: "Recomendaciones",
    observations: "Observaciones",
    signer: "Nombre del cliente o representante",
    signature: "Firma del cliente",
    signatureHelp: "El cliente puede firmar con el dedo, mouse o trackpad.",
    clear: "Limpiar",
    save: "Guardar borrador",
    sign: "Firmar y guardar",
    print: "Imprimir / PDF",
    email: "Correo",
    close: "Cerrar",
    signed: "Firmado",
    draft: "Borrador",
    signerRequired: "Escribe el nombre de la persona que firma.",
    signatureRequired: "El cliente debe firmar el informe.",
    noEmail: "El cliente no tiene correo electrónico registrado.",
    reportTitle: "INFORME DE INSPECCIÓN DE MONÓXIDO DE CARBONO (CO)",
    findingsIntro:
      "Durante la inspección del sistema de calefacción se detectó la posible presencia de monóxido de carbono. Se recomienda una evaluación completa para identificar la fuente de la emisión.",
    recommendationsIntro:
      "De acuerdo con las condiciones observadas, se comunicaron las siguientes recomendaciones:",
    rights: "Todos los derechos reservados.",
  },
  en: {
    title: "Carbon monoxide inspection report",
    report: "Report",
    date: "Date",
    customer: "Customer",
    address: "Address",
    technician: "Technician",
    equipment: "Equipment inspected",
    model: "Model / serial number",
    measurements: "CO measurements",
    ambient: "Ambient",
    equipmentArea: "Equipment area",
    vent: "Vent / exhaust",
    other: "Other",
    description: "Description",
    value: "Value",
    alarm: "The CO alarm or detector activated",
    visual: "A visual system inspection was performed",
    findings: "Findings",
    recommendations: "Recommendations",
    observations: "Observations",
    signer: "Customer or representative name",
    signature: "Customer signature",
    signatureHelp: "The customer can sign with a finger, mouse, or trackpad.",
    clear: "Clear",
    save: "Save draft",
    sign: "Sign and save",
    print: "Print / PDF",
    email: "Email",
    close: "Close",
    signed: "Signed",
    draft: "Draft",
    signerRequired: "Enter the name of the person signing.",
    signatureRequired: "The customer must sign the report.",
    noEmail: "The customer does not have an email address on file.",
    reportTitle: "CARBON MONOXIDE (CO) INSPECTION REPORT",
    findingsIntro:
      "During the heating-system inspection, the possible presence of carbon monoxide was detected. A complete evaluation is recommended to identify the source of the emission.",
    recommendationsIntro:
      "Based on the conditions observed, the following recommendations were communicated:",
    rights: "All rights reserved.",
  },
};

const FINDINGS = [
  {
    id: "heatExchanger",
    es: "Intercambiador de calor agrietado o dañado.",
    en: "Cracked or damaged heat exchanger.",
  },
  {
    id: "combustion",
    es: "Mala combustión del quemador.",
    en: "Improper burner combustion.",
  },
  {
    id: "venting",
    es: "Obstrucción o falla en el sistema de ventilación.",
    en: "Obstruction or failure in the venting system.",
  },
  {
    id: "gasPressure",
    es: "Presión de gas incorrecta.",
    en: "Incorrect gas pressure.",
  },
  {
    id: "maintenance",
    es: "Falta de mantenimiento o acumulación de residuos.",
    en: "Lack of maintenance or debris accumulation.",
  },
];

const RECOMMENDATIONS = [
  {
    id: "shutdown",
    es: "Apagar el sistema de calefacción inmediatamente.",
    en: "Shut down the heating system immediately.",
  },
  {
    id: "doNotOperate",
    es: "No operar el equipo mientras exista riesgo de exposición.",
    en: "Do not operate the equipment while an exposure risk exists.",
  },
  {
    id: "repair",
    es: "Realizar una inspección y reparación completa antes de usar nuevamente el equipo.",
    en: "Perform a complete inspection and repair before returning the equipment to service.",
  },
  {
    id: "detectors",
    es: "Verificar el funcionamiento de los detectores de CO.",
    en: "Verify proper operation of the CO detectors.",
  },
];

function buildForm(informe) {
  return {
    ...informe,
    idioma: informe?.idioma || "es",
    fecha: informe?.fecha || new Date().toISOString().slice(0, 10),
    equipo: informe?.equipo || "",
    modeloSerie: informe?.modeloSerie || "",

    medicionAmbiente: informe?.medicionAmbiente ?? "",
    medicionEquipo: informe?.medicionEquipo ?? "",
    medicionVentilacion: informe?.medicionVentilacion ?? "",

    medicionOtrosActiva: Boolean(informe?.medicionOtrosActiva),
    medicionOtrosDetalle: informe?.medicionOtrosDetalle || "",
    medicionOtrosValor: informe?.medicionOtrosValor ?? "",

    alarmaActivada:
      informe?.alarmaActivada === undefined
        ? true
        : Boolean(informe.alarmaActivada),

    inspeccionVisual:
      informe?.inspeccionVisual === undefined
        ? true
        : Boolean(informe.inspeccionVisual),

    hallazgos: informe?.hallazgos || {},
    hallazgosOtrosActiva: Boolean(informe?.hallazgosOtrosActiva),
    hallazgosOtros: informe?.hallazgosOtros || "",

    recomendaciones: informe?.recomendaciones || {},
    recomendacionesOtrosActiva: Boolean(
      informe?.recomendacionesOtrosActiva
    ),
    recomendacionesOtros: informe?.recomendacionesOtros || "",

    observaciones: informe?.observaciones || "",
    nombreFirmante: informe?.nombreFirmante || "",
    firmaCliente: informe?.firmaCliente || "",
    firmadoAt: informe?.firmadoAt || "",
  };
}

function CheckItem({ checked, onChange, children }) {
  return (
    <label
      className={
        "flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition " +
        (checked
          ? "border-blue-300 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-700")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 rounded"
      />
      <span>{children}</span>
    </label>
  );
}

export default function InformeCOModal({
  open,
  informe,
  cliente,
  tecnico,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => buildForm(informe));
  const [saving, setSaving] = useState(false);
  const [hasSignature, setHasSignature] = useState(
    Boolean(informe?.firmaCliente)
  );

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (!open || !informe) return;

    setForm(buildForm(informe));
    setHasSignature(Boolean(informe.firmaCliente));
  }, [open, informe?.id, informe?.updatedAt]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const timer = window.setTimeout(() => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const ctx = canvas.getContext("2d");

      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#0f172a";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (informe.firmaCliente) {
        const image = new Image();

        image.onload = () => {
          ctx.drawImage(image, 0, 0, rect.width, rect.height);
        };

        image.src = informe.firmaCliente;
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [open, informe?.id]);

  if (!open || !informe) return null;

  const copy = COPY[form.idioma] || COPY.es;

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const getPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const source = event.touches?.[0] || event;

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(event);

    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;

    event.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(event);

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);

    setForm((current) => ({
      ...current,
      firmaCliente: "",
      firmadoAt: "",
      estado: "borrador",
    }));
  };

  const saveReport = async (finalize = false) => {
    if (finalize && !String(form.nombreFirmante || "").trim()) {
      alert(copy.signerRequired);
      return null;
    }

    if (finalize && !hasSignature) {
      alert(copy.signatureRequired);
      return null;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        estado: finalize ? "firmado" : "borrador",
        firmaCliente: finalize
          ? canvasRef.current.toDataURL("image/png")
          : form.firmaCliente,
        firmadoAt: finalize
          ? new Date().toISOString()
          : form.firmadoAt || "",
      };

      const saved = await onSave(payload);

      if (saved) {
        setForm(buildForm(saved));
        setHasSignature(Boolean(saved.firmaCliente));
      }

      return saved;
    } catch (error) {
      console.error("Error guardando informe CO:", error);
      alert(error?.message || "No se pudo guardar el informe CO.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const printReport = () => {
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      alert(
        form.idioma === "en"
          ? "The browser blocked the report window."
          : "El navegador bloqueó la ventana del informe."
      );
      return;
    }

    const printable = document.getElementById("co-report-print");

    if (!printable) {
      previewWindow.close();

      alert(
        form.idioma === "en"
          ? "The printable report could not be found."
          : "No se encontró el informe imprimible."
      );

      return;
    }

    const clone = printable.cloneNode(true);

    clone.classList.remove("hidden");
    clone.classList.remove("print:block");

    clone.style.display = "block";
    clone.style.position = "static";
    clone.style.visibility = "visible";
    clone.style.width = "100%";
    clone.style.maxWidth = "100%";
    clone.style.margin = "0";
    clone.style.padding = "0";

    /*
     * La firma dibujada vive en el canvas.
     * La insertamos directamente en la copia imprimible,
     * aunque todavía no se haya vuelto a guardar.
     */
    const signatureData =
      hasSignature && canvasRef.current
        ? canvasRef.current.toDataURL("image/png")
        : form.firmaCliente || "";

    const signatureBox = clone.querySelector(
      '[data-co-print-signature="true"]'
    );

    if (signatureBox && signatureData) {
      let signatureImage = signatureBox.querySelector("img");

      if (!signatureImage) {
        signatureImage = document.createElement("img");
        signatureImage.alt =
          form.idioma === "en"
            ? "Customer signature"
            : "Firma del cliente";

        signatureImage.className =
          "mx-auto h-24 w-full object-contain";

        signatureBox.insertBefore(
          signatureImage,
          signatureBox.firstChild
        );
      }

      signatureImage.src = signatureData;
    }

    const sharedStyles = Array.from(
      document.head.querySelectorAll(
        'link[rel="stylesheet"], style'
      )
    )
      .map((node) => node.outerHTML)
      .join("\n");

    const title =
      form.idioma === "en"
        ? `CO Inspection Report - ${form.numeroInforme}`
        : `Informe de inspección CO - ${form.numeroInforme}`;

    const printLabel =
      form.idioma === "en"
        ? "Print / Save PDF"
        : "Imprimir / Guardar PDF";

    const closeLabel =
      form.idioma === "en"
        ? "Close"
        : "Cerrar";

    previewWindow.document.open();

    previewWindow.document.write(`<!doctype html>
<html lang="${form.idioma || "es"}">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <base href="${window.location.origin}/" />

  <title>${title}</title>

  ${sharedStyles}

  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #cbd5e1;
      color: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .report-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 18px;
      background: linear-gradient(
        90deg,
        #020617,
        #172554,
        #155e75
      );
      color: white;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
    }

    .report-toolbar-title {
      min-width: 0;
      overflow: hidden;
      font-size: 14px;
      font-weight: 900;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .report-toolbar-actions {
      display: flex;
      flex-shrink: 0;
      gap: 8px;
    }

    .report-toolbar button {
      border: 0;
      border-radius: 12px;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 900;
    }

    .print-button {
      background: #22d3ee;
      color: #082f49;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.14);
      color: white;
    }

    .report-page {
      width: 8.5in;
      min-height: 11in;
      margin: 20px auto;
      padding: 0.32in;
      overflow: visible;
      background: white;
      box-shadow: 0 20px 55px rgba(15, 23, 42, 0.25);
    }

    #co-report-print {
      display: block !important;
      position: static !important;
      width: 100% !important;
      max-width: 100% !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      visibility: visible !important;
      background: white !important;
      color: #0f172a !important;
      font-size: 9.5px !important;
      line-height: 1.25 !important;
    }

    #co-report-print,
    #co-report-print * {
      box-sizing: border-box !important;
      overflow-wrap: anywhere;
    }

    #co-report-print header {
      padding-bottom: 7px !important;
    }

    #co-report-print h1 {
      font-size: 17px !important;
      line-height: 1.05 !important;
    }

    #co-report-print h2 {
      margin: 7px 0 !important;
      padding: 7px 9px !important;
      font-size: 13px !important;
      line-height: 1.15 !important;
    }

    #co-report-print .grid {
      gap: 5px !important;
    }

    #co-report-print .gap-4 {
      gap: 7px !important;
    }

    #co-report-print .gap-2 {
      gap: 4px !important;
    }

    #co-report-print .p-4 {
      padding: 6px !important;
    }

    #co-report-print .p-3 {
      padding: 5px !important;
    }

    #co-report-print .mt-6,
    #co-report-print .mt-5 {
      margin-top: 7px !important;
    }

    #co-report-print .mt-4 {
      margin-top: 6px !important;
    }

    #co-report-print .mt-3,
    #co-report-print .mt-2 {
      margin-top: 4px !important;
    }

    #co-report-print .my-5 {
      margin-top: 7px !important;
      margin-bottom: 7px !important;
    }

    #co-report-print .h-20 {
      height: 48px !important;
    }

    #co-report-print .w-32 {
      width: 86px !important;
    }

    #co-report-print .h-24 {
      height: 52px !important;
    }

    #co-report-print img {
      object-fit: contain !important;
    }

    #co-report-print ul {
      margin-top: 3px !important;
      margin-bottom: 0 !important;
    }

    #co-report-print li {
      margin-top: 1px !important;
    }

    #co-report-print footer {
      margin-top: 7px !important;
      padding-top: 5px !important;
    }

    @page {
      size: Letter portrait;
      margin: 0.30in;
    }

    @media print {
      html,
      body {
        width: auto;
        min-width: 0;
        margin: 0;
        padding: 0;
        background: white;
      }

      .report-toolbar {
        display: none !important;
      }

      .report-page {
        width: auto;
        min-height: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }

      #co-report-print {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #co-report-print > header,
      #co-report-print > section,
      #co-report-print > div,
      #co-report-print > footer {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>

<body>
  <header class="report-toolbar">
    <div class="report-toolbar-title">
      ${title}
    </div>

    <div class="report-toolbar-actions">
      <button
        type="button"
        class="print-button"
        onclick="window.print()"
      >
        ${printLabel}
      </button>

      <button
        type="button"
        class="close-button"
        onclick="window.close()"
      >
        ${closeLabel}
      </button>
    </div>
  </header>

  <main class="report-page">
    ${clone.outerHTML}
  </main>
</body>
</html>`);

    previewWindow.document.close();
    previewWindow.focus();
  };

  const prepareEmail = async () => {
    const email = String(cliente?.email || "").trim();

    if (!email) {
      alert(copy.noEmail);
      return;
    }

    const saved = await saveReport(true);
    if (!saved) return;

    const subject = `${copy.reportTitle} - ${saved.numeroInforme}`;

    const body = [
      copy.reportTitle,
      "",
      `${copy.report}: ${saved.numeroInforme}`,
      `${copy.customer}: ${saved.clienteNombre}`,
      `${copy.address}: ${saved.direccionTrabajo}`,
      `${copy.technician}: ${saved.tecnicoNombre}`,
      "",
      "Maldonado HVAC",
      "816-785-1516",
      "hvacmaldonado.com",
    ].join("\n");

    window.location.href =
      `mailto:${encodeURIComponent(email)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  const selectedFindings = FINDINGS.filter(
    (item) => form.hallazgos?.[item.id]
  );

  const selectedRecommendations = RECOMMENDATIONS.filter(
    (item) => form.recomendaciones?.[item.id]
  );

  return (
    <div className="co-report-root fixed inset-0 z-[995] overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md">
      <style>{`
        @media print {
          @page {
            size: Letter portrait;
            margin: 0.28in;
          }

          html,
          body,
          #root {
            width: auto !important;
            min-width: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          .app-shell > * {
            display: none !important;
          }

          .app-shell > .co-report-root {
            display: block !important;
          }

          .co-report-root {
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            backdrop-filter: none !important;
          }

          .co-report-screen {
            display: none !important;
          }

          #co-report-print {
            display: block !important;
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 9.5px !important;
            line-height: 1.25 !important;
            box-sizing: border-box !important;
          }

          #co-report-print,
          #co-report-print * {
            box-sizing: border-box !important;
            max-width: 100%;
            overflow-wrap: anywhere;
          }

          #co-report-print header {
            padding-bottom: 7px !important;
          }

          #co-report-print h1 {
            font-size: 17px !important;
            line-height: 1.05 !important;
          }

          #co-report-print h2 {
            margin-top: 7px !important;
            margin-bottom: 7px !important;
            padding: 7px 9px !important;
            font-size: 13px !important;
            line-height: 1.15 !important;
          }

          #co-report-print .grid {
            gap: 5px !important;
          }

          #co-report-print .gap-4 {
            gap: 7px !important;
          }

          #co-report-print .gap-2 {
            gap: 4px !important;
          }

          #co-report-print .p-4 {
            padding: 6px !important;
          }

          #co-report-print .p-3 {
            padding: 5px !important;
          }

          #co-report-print .mt-6,
          #co-report-print .mt-5 {
            margin-top: 7px !important;
          }

          #co-report-print .mt-4 {
            margin-top: 6px !important;
          }

          #co-report-print .mt-3,
          #co-report-print .mt-2 {
            margin-top: 4px !important;
          }

          #co-report-print .my-5 {
            margin-top: 7px !important;
            margin-bottom: 7px !important;
          }

          #co-report-print .rounded-xl {
            border-radius: 7px !important;
          }

          #co-report-print .h-20 {
            height: 48px !important;
          }

          #co-report-print .w-32 {
            width: 86px !important;
          }

          #co-report-print .h-24 {
            height: 48px !important;
          }

          #co-report-print ul {
            margin-top: 3px !important;
            margin-bottom: 0 !important;
          }

          #co-report-print li {
            margin-top: 1px !important;
          }

          #co-report-print img {
            object-fit: contain !important;
          }

          #co-report-print footer {
            margin-top: 7px !important;
            padding-top: 5px !important;
          }

          #co-report-print > div,
          #co-report-print > section,
          #co-report-print > header,
          #co-report-print > footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="co-report-screen mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl">
        <header className="sticky top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 p-4 text-white">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-300">
              {copy.report}: {form.numeroInforme}
            </p>

            <h2 className="mt-1 flex items-center gap-2 text-xl font-black">
              <ShieldAlert size={24} />
              {copy.title}
            </h2>

            <span className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black ring-1 ring-white/20">
              {form.estado === "firmado" ? copy.signed : copy.draft}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update("idioma", "es")}
              className={
                "rounded-xl px-3 py-2 text-xs font-black " +
                (form.idioma === "es"
                  ? "bg-cyan-300 text-slate-950"
                  : "bg-white/10")
              }
            >
              ES
            </button>

            <button
              type="button"
              onClick={() => update("idioma", "en")}
              className={
                "rounded-xl px-3 py-2 text-xs font-black " +
                (form.idioma === "en"
                  ? "bg-cyan-300 text-slate-950"
                  : "bg-white/10")
              }
            >
              EN
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <main className="p-3 sm:p-5">
          <section className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-xl">
            <div className="grid gap-3 border-b bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500">
                  {copy.customer}
                </p>
                <p className="mt-1 text-sm font-black">
                  {form.clienteNombre || "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-500">
                  {copy.address}
                </p>
                <p className="mt-1 text-sm font-black">
                  {[form.direccionTrabajo, form.ubicacionEtiqueta]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-500">
                  {copy.technician}
                </p>
                <p className="mt-1 text-sm font-black">
                  {form.tecnicoNombre || tecnico?.nombre || "—"}
                </p>
              </div>

              <label>
                <span className="text-[9px] font-black uppercase text-slate-500">
                  {copy.date}
                </span>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(event) =>
                    update("fecha", event.target.value)
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>
            </div>

            <div className="grid gap-3 border-b p-4 sm:grid-cols-2">
              <label>
                <span className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                  {copy.equipment}
                </span>
                <input
                  value={form.equipo}
                  onChange={(event) =>
                    update("equipo", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                  {copy.model}
                </span>
                <input
                  value={form.modeloSerie}
                  onChange={(event) =>
                    update("modeloSerie", event.target.value)
                  }
                  className={inputClass}
                />
              </label>
            </div>

            <div className="border-b p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black">
                <Gauge size={18} className="text-blue-700" />
                {copy.measurements}
              </h3>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["medicionAmbiente", copy.ambient],
                  ["medicionEquipo", copy.equipmentArea],
                  ["medicionVentilacion", copy.vent],
                ].map(([field, label]) => (
                  <label key={field}>
                    <span className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                      {label} (ppm)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form[field]}
                      onChange={(event) =>
                        update(field, event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-3">
                <CheckItem
                  checked={form.medicionOtrosActiva}
                  onChange={(event) =>
                    update("medicionOtrosActiva", event.target.checked)
                  }
                >
                  {copy.other}
                </CheckItem>

                {form.medicionOtrosActiva && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_160px]">
                    <input
                      value={form.medicionOtrosDetalle}
                      onChange={(event) =>
                        update(
                          "medicionOtrosDetalle",
                          event.target.value
                        )
                      }
                      placeholder={copy.description}
                      className={inputClass}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.medicionOtrosValor}
                      onChange={(event) =>
                        update(
                          "medicionOtrosValor",
                          event.target.value
                        )
                      }
                      placeholder={`${copy.value} ppm`}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <CheckItem
                  checked={form.alarmaActivada}
                  onChange={(event) =>
                    update("alarmaActivada", event.target.checked)
                  }
                >
                  {copy.alarm}
                </CheckItem>

                <CheckItem
                  checked={form.inspeccionVisual}
                  onChange={(event) =>
                    update("inspeccionVisual", event.target.checked)
                  }
                >
                  {copy.visual}
                </CheckItem>
              </div>
            </div>

            <div className="grid gap-4 border-b p-4 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black">
                  <AlertTriangle size={18} className="text-amber-600" />
                  {copy.findings}
                </h3>

                <div className="grid gap-2">
                  {FINDINGS.map((item) => (
                    <CheckItem
                      key={item.id}
                      checked={Boolean(form.hallazgos?.[item.id])}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          hallazgos: {
                            ...current.hallazgos,
                            [item.id]: event.target.checked,
                          },
                        }))
                      }
                    >
                      {item[form.idioma]}
                    </CheckItem>
                  ))}

                  <CheckItem
                    checked={form.hallazgosOtrosActiva}
                    onChange={(event) =>
                      update(
                        "hallazgosOtrosActiva",
                        event.target.checked
                      )
                    }
                  >
                    {copy.other}
                  </CheckItem>

                  {form.hallazgosOtrosActiva && (
                    <textarea
                      value={form.hallazgosOtros}
                      onChange={(event) =>
                        update("hallazgosOtros", event.target.value)
                      }
                      className={`${inputClass} min-h-20 resize-y`}
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />
                  {copy.recommendations}
                </h3>

                <div className="grid gap-2">
                  {RECOMMENDATIONS.map((item) => (
                    <CheckItem
                      key={item.id}
                      checked={Boolean(
                        form.recomendaciones?.[item.id]
                      )}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          recomendaciones: {
                            ...current.recomendaciones,
                            [item.id]: event.target.checked,
                          },
                        }))
                      }
                    >
                      {item[form.idioma]}
                    </CheckItem>
                  ))}

                  <CheckItem
                    checked={form.recomendacionesOtrosActiva}
                    onChange={(event) =>
                      update(
                        "recomendacionesOtrosActiva",
                        event.target.checked
                      )
                    }
                  >
                    {copy.other}
                  </CheckItem>

                  {form.recomendacionesOtrosActiva && (
                    <textarea
                      value={form.recomendacionesOtros}
                      onChange={(event) =>
                        update(
                          "recomendacionesOtros",
                          event.target.value
                        )
                      }
                      className={`${inputClass} min-h-20 resize-y`}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-b p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-black">
                <FileText size={18} className="text-blue-700" />
                {copy.observations}
              </h3>

              <textarea
                value={form.observaciones}
                onChange={(event) =>
                  update("observaciones", event.target.value)
                }
                className={`${inputClass} min-h-24 resize-y`}
              />
            </div>

            <div className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black">
                <PenLine size={18} className="text-violet-700" />
                {copy.signature}
              </h3>

              <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
                <label>
                  <span className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                    {copy.signer}
                  </span>

                  <input
                    value={form.nombreFirmante}
                    onChange={(event) =>
                      update("nombreFirmante", event.target.value)
                    }
                    className={inputClass}
                  />
                </label>

                <div>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="h-36 w-full touch-none rounded-xl border-2 border-dashed border-slate-300 bg-white"
                  />

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold text-slate-500">
                      {copy.signatureHelp}
                    </p>

                    <button
                      type="button"
                      onClick={clearSignature}
                      className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black"
                    >
                      <Eraser size={14} />
                      {copy.clear}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="sticky bottom-2 mt-3 grid gap-2 rounded-2xl border bg-white/95 p-3 shadow-2xl backdrop-blur sm:grid-cols-2 xl:grid-cols-5">
            <button
              type="button"
              disabled={saving}
              onClick={() => saveReport(false)}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-black"
            >
              <Save size={16} />
              {copy.save}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveReport(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-3 py-3 text-xs font-black text-white"
            >
              <PenLine size={16} />
              {copy.sign}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={printReport}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-black text-white"
            >
              <Printer size={16} />
              {copy.print}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={prepareEmail}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-3 text-xs font-black text-white"
            >
              <Mail size={16} />
              {copy.email}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-3 py-3 text-xs font-black"
            >
              <X size={16} />
              {copy.close}
            </button>
          </div>
        </main>
      </div>

      <section
        id="co-report-print"
        className="hidden bg-white text-slate-950 print:block"
      >
        <header className="flex items-start justify-between border-b-4 border-slate-950 pb-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo-hvac-premium.png"
              alt="Maldonado HVAC"
              className="h-20 w-32 object-contain"
            />

            <div>
              <h1 className="text-2xl font-black">Maldonado HVAC</h1>
              <p className="font-bold text-slate-600">
                HVAC Refrigeración Maldonado R
              </p>
              <p className="text-sm font-bold text-blue-700">
                816-785-1516 · hvacmaldonado.com
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-black uppercase text-slate-500">
              {copy.report}
            </p>
            <p className="text-lg font-black">{form.numeroInforme}</p>
            <p className="mt-1 font-bold">{form.fecha}</p>
          </div>
        </header>

        <h2 className="my-5 rounded-xl bg-slate-950 p-4 text-center text-xl font-black text-white">
          {copy.reportTitle}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-4">
            <p className="text-xs font-black uppercase text-blue-700">
              {copy.customer}
            </p>
            <p className="mt-2 font-black">{form.clienteNombre}</p>
            <p className="mt-1">
              {[form.direccionTrabajo, form.ubicacionEtiqueta]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs font-black uppercase text-blue-700">
              {copy.technician}
            </p>
            <p className="mt-2 font-black">{form.tecnicoNombre}</p>
            <p className="mt-1">{form.equipo}</p>
            <p>{form.modeloSerie}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="font-black text-blue-700">
            {copy.measurements}
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-blue-50 p-3">
              {copy.ambient}
              <br />
              <strong>{form.medicionAmbiente || "—"} ppm</strong>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              {copy.equipmentArea}
              <br />
              <strong>{form.medicionEquipo || "—"} ppm</strong>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              {copy.vent}
              <br />
              <strong>{form.medicionVentilacion || "—"} ppm</strong>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              {form.medicionOtrosDetalle || copy.other}
              <br />
              <strong>{form.medicionOtrosValor || "—"} ppm</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="font-black text-blue-700">{copy.findings}</p>
          <p className="my-2 text-sm">{copy.findingsIntro}</p>

          <ul className="list-disc space-y-1 pl-5">
            {selectedFindings.map((item) => (
              <li key={item.id}>{item[form.idioma]}</li>
            ))}

            {form.hallazgosOtrosActiva &&
              form.hallazgosOtros && <li>{form.hallazgosOtros}</li>}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="font-black text-blue-700">
            {copy.recommendations}
          </p>

          <p className="my-2 text-sm">
            {copy.recommendationsIntro}
          </p>

          <ul className="list-disc space-y-1 pl-5">
            {selectedRecommendations.map((item) => (
              <li key={item.id}>{item[form.idioma]}</li>
            ))}

            {form.recomendacionesOtrosActiva &&
              form.recomendacionesOtros && (
                <li>{form.recomendacionesOtros}</li>
              )}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="font-black text-blue-700">
            {copy.observations}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            {form.observaciones}
          </p>
        </div>

        <div
          data-co-print-signature="true"
          className="mt-5 rounded-xl border p-4 text-center"
        >
          {form.firmaCliente && (
            <img
              src={form.firmaCliente}
              alt={copy.signature}
              className="mx-auto h-24 w-full object-contain"
            />
          )}

          <div className="mt-2 border-t pt-2 font-black">
            {form.nombreFirmante}
          </div>

          <p className="text-xs text-slate-500">{copy.signature}</p>
        </div>

        <footer className="mt-6 border-t pt-3 text-center text-xs font-bold text-slate-500">
          © {new Date().getFullYear()} Maldonado HVAC. {copy.rights}
        </footer>
      </section>
    </div>
  );
}
