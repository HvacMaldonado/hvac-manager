import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eraser,
  Languages,
  Printer,
  Save,
  Share2,
  Signature,
  X,
} from "lucide-react";

const UI = {
  es: {
    title: "Informe de puesta en marcha",
    subtitle: "Aire acondicionado y calefacción",
    draft: "Borrador",
    signed: "Firmado",
    page1: "Equipos e instalación",
    page2: "Mediciones y pruebas",
    signaturePage: "Firma del cliente",
    customer: "Cliente",
    address: "Dirección",
    building: "Edificio",
    apartment: "Apartamento / unidad",
    phone: "Teléfono",
    technician: "Técnico",
    contractor: "Contratista instalador",
    date: "Fecha de puesta en marcha",
    previous: "Anterior",
    next: "Siguiente",
    saveDraft: "Guardar borrador",
    signSave: "Firmar y guardar",
    close: "Cerrar",
    signerName: "Nombre de quien firma",
    signature: "Firma del cliente",
    signatureHelp: "El cliente puede firmar con el dedo, mouse o trackpad.",
    clear: "Limpiar firma",
    signerRequired: "Escribe el nombre de la persona que firma.",
    signatureRequired: "El cliente debe firmar el informe.",
    saved: "Informe guardado correctamente.",
    saveFailed: "No se pudo guardar el informe de puesta en marcha.",
    readOnly: "Este informe es de solo lectura.",
    print: "Imprimir / PDF",
    share: "Compartir",
    popupBlocked: "Permite ventanas emergentes para imprimir el informe.",
    shareFailed: "No se pudo abrir el menú para compartir.",
    yes: "Sí",
    no: "No",
  },
  en: {
    title: "Start-Up Report",
    subtitle: "Air Conditioning and Heating",
    draft: "Draft",
    signed: "Signed",
    page1: "Equipment and installation",
    page2: "Measurements and tests",
    signaturePage: "Customer signature",
    customer: "Customer",
    address: "Address",
    building: "Building",
    apartment: "Apartment / unit",
    phone: "Phone number",
    technician: "Technician",
    contractor: "Installing contractor",
    date: "Start-up date",
    previous: "Previous",
    next: "Next",
    saveDraft: "Save draft",
    signSave: "Sign and save",
    close: "Close",
    signerName: "Signer name",
    signature: "Customer signature",
    signatureHelp: "The customer can sign with a finger, mouse or trackpad.",
    clear: "Clear signature",
    signerRequired: "Enter the name of the person signing.",
    signatureRequired: "The customer must sign the report.",
    saved: "Report saved successfully.",
    saveFailed: "The Start-Up Report could not be saved.",
    readOnly: "This report is read-only.",
    print: "Print / PDF",
    share: "Share",
    popupBlocked: "Allow pop-up windows to print the report.",
    shareFailed: "The sharing menu could not be opened.",
    yes: "Yes",
    no: "No",
  },
};

const PAGE_ONE = [
  {
    id: "equipment",
    title: { es: "Datos del equipo", en: "Equipment Data" },
    fields: [
      {
        key: "airflowDirection",
        type: "radio",
        label: { es: "Configuración de flujo", en: "Airflow configuration" },
        options: [
          ["upflow", "Upflow"],
          ["downflow", "Downflow"],
          ["horizontalLeft", "Horizontal Left"],
          ["horizontalRight", "Horizontal Right"],
        ],
      },
      ["indoorUnitModel", "Modelo unidad interior", "Indoor unit model #"],
      ["indoorUnitSerial", "Serial unidad interior", "Indoor unit serial #"],
      ["indoorCoilModel", "Modelo serpentín interior", "Indoor coil model #"],
      ["indoorCoilSerial", "Serial serpentín interior", "Indoor coil serial #"],
      ["outdoorUnitModel", "Modelo unidad exterior", "Outdoor unit model #"],
      ["outdoorUnitSerial", "Serial unidad exterior", "Outdoor unit serial #"],
    ],
  },
  {
    id: "filter",
    title: {
      es: "Filtro, termostato y accesorios",
      en: "Filter, Thermostat and Accessories",
    },
    fields: [
      ["filterType", "Tipo de filtro", "Filter type"],
      ["filterSize", "Tamaño del filtro", "Filter size"],
      ["filterLocations", "Ubicación del filtro", "Filter location(s)"],
      ["thermostatType", "Tipo de termostato", "Thermostat type"],
      ["otherEquipment", "Otros equipos y accesorios", "Other equipment and accessories"],
    ],
  },
  {
    id: "connections",
    title: {
      es: "Conexiones según instrucciones y códigos locales",
      en: "Connections per Instructions and Local Codes",
    },
    fields: [
      ["unitLevel", "Unidad nivelada", "Unit is level", "checkbox"],
      ["ductsSealed", "Ductos de suministro y retorno conectados y sellados", "Supply and return ducts connected and sealed", "checkbox"],
      ["refrigerantLeakTested", "Tubería de refrigerante completa y probada contra fugas", "Refrigerant piping complete and leak tested", "checkbox"],
      ["gasPipingConnected", "Tubería de gas conectada, si aplica", "Gas piping connected, if applicable", "checkbox"],
      ["ventSystemConnected", "Sistema de ventilación conectado, si aplica", "Vent system connected, if applicable", "checkbox"],
      ["indoorDrainConnected", "Drenaje de serpentín interior conectado", "Indoor coil condensate drain connected", "checkbox"],
      ["furnaceDrainConnected", "Drenaje del horno conectado, si aplica", "Furnace condensate drain connected, if applicable", "checkbox"],
    ],
  },
  {
    id: "lineVoltage",
    title: { es: "Electricidad: voltaje de línea", en: "Electrical: Line Voltage" },
    fields: [
      ["indoorVolts", "Unidad interior (V AC)", "Indoor unit volts AC", "number"],
      ["outdoorVolts", "Unidad exterior (V AC)", "Outdoor unit volts AC", "number"],
      ["breakerAmps", "Breaker/fusibles (A)", "Breaker/Fuses amperes", "number"],
      ["groundConnected", "Cable a tierra conectado", "Ground wire connected", "checkbox"],
      ["polarityCorrect", "Polaridad correcta", "Polarity is correct", "checkbox"],
    ],
  },
  {
    id: "lowVoltage",
    title: { es: "Electricidad: bajo voltaje", en: "Electrical: Low Voltage" },
    fields: [
      ["thermostatWiringComplete", "Cableado de termostato completo", "Thermostat wiring complete", "checkbox"],
      ["heatAnticipatorSet", "Anticipador ajustado según instrucciones", "Heat anticipator set per instructions", "checkbox"],
      ["heatAnticipatorValue", "Valor recomendado del anticipador", "Heat anticipator recommended value"],
      ["indoorControlVoltage", "R y C en control interior (V AC)", "R and C indoor control voltage", "number"],
      ["outdoorControlVoltage", "R y C en control exterior (V AC)", "R and C outdoor control voltage", "number"],
    ],
  },
  {
    id: "heating",
    title: { es: "Configuración de calefacción", en: "Heating Set-Up" },
    fields: [
      {
        key: "heatingType",
        type: "radio",
        label: { es: "Tipo de calefacción", en: "Heating type" },
        options: [
          ["electric", "Electric Air Handler"],
          ["naturalGas", "Natural Gas"],
          ["lpGas", "LP Gas"],
        ],
      },
      ["inletGasPressure", "Presión de entrada de gas (in. w.c.)", "Inlet gas pressure", "number"],
      ["manifoldGasPressure", "Presión del manifold (in. w.c.)", "Manifold gas pressure", "number"],
      ["lpConversionKit", "Kit de conversión LP usado", "LP conversion kit part #"],
      ["calculatedInput", "Entrada calculada BTUH", "Calculated input BTUH", "number"],
      ["lpKitInstalledBy", "Kit LP instalado por", "LP kit installed by"],
      ["electricHeatKit", "Número de kit eléctrico", "Electric heat kit part #"],
      ["kwInstalled", "KW instalados", "KW installed", "number"],
      ["ratedBtuh", "BTU/H nominal", "Rated BTU/H", "number"],
    ],
  },
  {
    id: "venting",
    title: { es: "Ventilación, si aplica", en: "Venting, if applicable" },
    fields: [
      ["ventProperlySized", "Sistema de ventilación correctamente dimensionado", "Venting system properly sized", "checkbox"],
      ["intakeSize", "Tamaño de entrada", "Intake size"],
      ["intake90Elbows", "Codos de entrada de 90°", "Intake 90° elbows", "number"],
      ["intake45Elbows", "Codos de entrada de 45°", "Intake 45° elbows", "number"],
      ["intakeLength", "Longitud de entrada", "Intake length", "number"],
      ["exhaustSize", "Tamaño de escape", "Exhaust size"],
      ["exhaust90Elbows", "Codos de escape de 90°", "Exhaust 90° elbows", "number"],
      ["exhaust45Elbows", "Codos de escape de 45°", "Exhaust 45° elbows", "number"],
      ["exhaustLength", "Longitud de escape", "Exhaust length", "number"],
    ],
  },
];

const PAGE_TWO = [
  {
    id: "blower",
    title: { es: "Configuración del blower", en: "Blower Type and Set-Up" },
    fields: [
      {
        key: "blowerType",
        type: "radio",
        label: { es: "Tipo de blower", en: "Blower type" },
        options: [
          ["variableECM", "Variable Speed ECM"],
          ["standardECM", "Standard ECM"],
        ],
      },
      ["blowerHeat", "Configuración Heat", "Heat setting"],
      ["blowerLowCool", "Configuración Low Cool", "Low cool setting"],
      ["blowerHighCool", "Configuración High Cool", "High cool setting"],
      ["blowerDelay", "Delay", "Delay"],
      ["blowerStage1Kw", "Stage 1 KW", "Stage 1 KW"],
      ["heatKitSelection", "Selección de heat kit", "Heat kit selection"],
      ["hpY1Speed", "HP heating/cooling Y1", "HP heating/cooling Y1"],
      ["hpY2Speed", "HP heating/cooling Y2", "HP heating/cooling Y2"],
      ["electricHeatSpeed", "Velocidad electric heat", "Electric heat speed"],
      ["continuousFanSpeed", "Velocidad continuous fan", "Continuous fan speed"],
    ],
  },
  {
    id: "airflow",
    title: { es: "Presión estática y temperaturas", en: "Static Pressure and Temperatures" },
    fields: [
      ["supplyStatic", "Estática de suministro (in. W.C.)", "Supply static", "number"],
      ["returnStatic", "Estática de retorno (in. W.C.)", "Return static", "number"],
      ["totalExternalStatic", "Presión estática externa total", "Total external static pressure", "number"],
      ["supplyDryBulb", "Suministro dry bulb", "Supply air dry bulb", "number"],
      ["returnDryBulb", "Retorno dry bulb", "Return air dry bulb", "number"],
      ["temperatureDrop", "Diferencia de temperatura", "Temperature drop", "number"],
      ["outsideDryBulb", "Exterior dry bulb", "Outside air dry bulb", "number"],
      ["returnWetBulb", "Retorno wet bulb", "Return air wet bulb", "number"],
      ["supplyWetBulb", "Suministro wet bulb", "Supply air wet bulb", "number"],
    ],
  },
  {
    id: "switches",
    title: { es: "Otros interruptores", en: "Other Switches" },
    fields: [
      {
        key: "humidistat",
        type: "radio",
        label: { es: "Humidistat", en: "Humidistat" },
        options: [["yes", "Yes"], ["no", "No"]],
      },
      {
        key: "acHpMode",
        type: "radio",
        label: { es: "Modo AC/HP", en: "AC/HP mode" },
        options: [["ac", "AC"], ["hp", "HP"]],
      },
      {
        key: "continuousFanPercent",
        type: "radio",
        label: { es: "Ventilador continuo", en: "Continuous fan" },
        options: [["40", "40%"], ["60", "60%"], ["80", "80%"], ["100", "100%"]],
      },
    ],
  },
  {
    id: "refrigerant",
    title: {
      es: "Carga de refrigerante y dispositivo de medición",
      en: "Refrigerant Charge and Metering Device",
    },
    fields: [
      {
        key: "refrigerantType",
        type: "radio",
        label: { es: "Refrigerante", en: "Refrigerant" },
        options: [["r407c", "R-407C"], ["r410a", "R-410A"]],
      },
      {
        key: "meteringDevice",
        type: "radio",
        label: { es: "Dispositivo", en: "Metering device" },
        options: [["txv", "TXV"], ["fixedOrifice", "Fixed Orifice"]],
      },
      ["additionalLinesetLength", "Longitud adicional de lineset", "Additional lineset length", "number"],
      ["adderPerFoot", "Carga adicional por pie (lb)", "Adder per foot (lbs)", "number"],
      ["refrigerantOunces", "Onzas adicionales", "Additional ounces", "number"],
      ["refrigerantElbows", "Número de codos", "Number of elbows", "number"],
      ["refrigerant45s", "Número de 45°", "Number of 45s", "number"],
      ["totalAddedLbs", "Total agregado (lb)", "Total added lbs", "number"],
      ["totalAddedOz", "Total agregado (oz)", "Total added oz", "number"],
      ["orificeSize", "Tamaño de orificio", "Orifice size"],
      ["liquidLineTemp", "Temperatura liquid line", "Liquid line temperature", "number"],
      ["highSidePressure", "Presión high side", "High side pressure", "number"],
      ["suctionLineTemp", "Temperatura suction line", "Suction line temperature", "number"],
      ["lowSidePressure", "Presión low side", "Low side pressure", "number"],
      ["txvNumber", "Número TXV", "TXV #"],
      ["subcooling", "Subcooling", "Subcooling", "number"],
      ["superheat", "Superheat", "Superheat", "number"],
    ],
  },
  {
    id: "cycle",
    title: { es: "Prueba de ciclos", en: "Cycle Test" },
    fields: [
      ["continuousFanTest", "Operar ciclos continuos del ventilador", "Operate continuous fan cycles", "checkbox"],
      ["coolingCycleTest", "Operar varios ciclos de enfriamiento", "Operate several cooling cycles", "checkbox"],
      ["heatingCycleTest", "Operar varios ciclos de calefacción, si aplica", "Operate several heating cycles, if applicable", "checkbox"],
    ],
  },
  {
    id: "cleanup",
    title: { es: "Limpieza", en: "Clean Up" },
    fields: [
      ["cleanupComplete", "Desechos retirados y áreas interior/exterior limpias", "Debris removed and indoor/outdoor areas cleaned", "checkbox"],
    ],
  },
  {
    id: "education",
    title: { es: "Educación del propietario", en: "Owner Education" },
    fields: [
      ["manualProvided", "Manual del propietario entregado", "Owner's manual provided", "checkbox"],
      ["systemOperationExplained", "Operación del sistema explicada", "System operation explained", "checkbox"],
      ["thermostatExplained", "Uso y programación del termostato explicados", "Thermostat use and programming explained", "checkbox"],
      ["maintenanceExplained", "Mantenimiento y cambio de filtro explicados", "Filter replacement and maintenance explained", "checkbox"],
    ],
  },
  {
    id: "comments",
    title: { es: "Comentarios", en: "Comments" },
    fields: [
      ["comments", "Comentarios del técnico", "Technician comments", "textarea"],
    ],
  },
];

function normalizeField(field) {
  if (!Array.isArray(field)) return field;

  return {
    key: field[0],
    label: { es: field[1], en: field[2] },
    type: field[3] || "text",
  };
}

function ReportSection({ section, idioma, datos, update, disabled }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-3 py-2 text-white">
        <h3 className="text-sm font-black">{section.title[idioma]}</h3>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
        {section.fields.map(normalizeField).map((field) => {
          if (field.type === "checkbox") {
            return (
              <label
                key={field.key}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5"
              >
                <input
                  type="checkbox"
                  checked={Boolean(datos[field.key])}
                  disabled={disabled}
                  onChange={(event) => update(field.key, event.target.checked)}
                  className="h-4 w-4 shrink-0 accent-blue-700"
                />
                <span className="text-xs font-bold leading-snug text-slate-700">
                  {field.label[idioma]}
                </span>
              </label>
            );
          }

          if (field.type === "radio") {
            return (
              <fieldset
                key={field.key}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:col-span-2 xl:col-span-4"
              >
                <legend className="px-1 text-xs font-black uppercase tracking-wide text-slate-500">
                  {field.label[idioma]}
                </legend>

                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {field.options.map(([value, label]) => (
                    <label
                      key={value}
                      className={
                        "flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black " +
                        (datos[field.key] === value
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-slate-200 bg-white text-slate-600")
                      }
                    >
                      <input
                        type="radio"
                        name={field.key}
                        value={value}
                        checked={datos[field.key] === value}
                        disabled={disabled}
                        onChange={() => update(field.key, value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }

          if (field.type === "textarea") {
            return (
              <label key={field.key} className="sm:col-span-2 xl:col-span-4">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {field.label[idioma]}
                </span>
                <textarea
                  value={datos[field.key] || ""}
                  disabled={disabled}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="min-h-24 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </label>
            );
          }

          return (
            <label key={field.key}>
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                {field.label[idioma]}
              </span>
              <input
                type={field.type === "number" ? "number" : "text"}
                step={field.type === "number" ? "any" : undefined}
                value={datos[field.key] ?? ""}
                disabled={disabled}
                onChange={(event) => update(field.key, event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}

export default function InformeStartupModal({
  open,
  informe,
  onClose,
  onSave,
  readOnly = false,
}) {
  const [form, setForm] = useState(informe || null);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(
    Boolean(informe?.firmaCliente)
  );

  const canvasRef = useRef(null);

  const idioma = form?.idioma === "en" ? "en" : "es";
  const copy = UI[idioma];

  useEffect(() => {
    if (!open || !informe) return;

    setForm({
      ...informe,
      datos: { ...(informe.datos || {}) },
    });
    setPage(1);
    setHasSignature(Boolean(informe.firmaCliente));
  }, [open, informe]);

  useEffect(() => {
    if (!open || page !== 3 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.max(Math.floor(rect.width * ratio), 1);
    canvas.height = Math.max(Math.floor(rect.height * ratio), 1);

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineWidth = 2.25;
    context.lineCap = "round";
    context.strokeStyle = "#0f172a";

    if (form?.firmaCliente) {
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, rect.width, rect.height);
        context.drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = form.firmaCliente;
    }
  }, [open, page, form?.firmaCliente]);

  if (!open || !form) return null;

  const updateData = (key, value) => {
    if (readOnly) return;

    setForm((current) => ({
      ...current,
      datos: {
        ...(current.datos || {}),
        [key]: value,
      },
    }));
  };

  const getPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getPoint(event);

    canvas.setPointerCapture?.(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing || readOnly) return;

    const context = canvasRef.current.getContext("2d");
    const point = getPoint(event);

    context.lineTo(point.x, point.y);
    context.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (event) => {
    canvasRef.current?.releasePointerCapture?.(event.pointerId);
    setDrawing(false);
  };

  const clearSignature = () => {
    if (readOnly || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    context.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    setForm((current) => ({
      ...current,
      firmaCliente: "",
      firmadoAt: "",
    }));
  };

  const save = async (finalize = false) => {
    if (readOnly) return;

    if (finalize && !String(form.nombreFirmante || "").trim()) {
      alert(copy.signerRequired);
      setPage(3);
      return;
    }

    if (finalize && !hasSignature) {
      alert(copy.signatureRequired);
      setPage(3);
      return;
    }

    try {
      setSaving(true);

      const firmaCliente =
        hasSignature && canvasRef.current
          ? canvasRef.current.toDataURL("image/png")
          : form.firmaCliente || "";

      const saved = await onSave({
        ...form,
        estado: finalize ? "firmado" : "borrador",
        firmaCliente,
        firmadoAt: finalize
          ? new Date().toISOString()
          : form.firmadoAt || "",
      });

      if (saved) {
        setForm(saved);
        setHasSignature(Boolean(saved.firmaCliente));
        alert(copy.saved);
      }
    } catch (error) {
      console.error("Error guardando Start-Up Report:", error);
      alert(error?.message || copy.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const escapePrintHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const normalizePrintField = (field) => {
    if (Array.isArray(field)) {
      return {
        key: field[0],
        label: idioma === "en" ? field[2] : field[1],
        type: field[3] || "text",
        options: [],
      };
    }

    return {
      key: field.key,
      label:
        field.label?.[idioma] ||
        field.label?.es ||
        field.key,
      type: field.type || "text",
      options: field.options || [],
    };
  };

  const getPrintValue = (rawField) => {
    const field = normalizePrintField(rawField);
    const value = form.datos?.[field.key];

    if (field.type === "checkbox") {
      return value ? copy.yes : copy.no;
    }

    if (field.type === "radio") {
      const option = field.options.find(
        (item) => item[0] === value
      );

      return option?.[1] || value || "—";
    }

    return value === undefined ||
      value === null ||
      value === ""
      ? "—"
      : String(value);
  };

  const generarDocumentoImprimible = () => {
    const paginas = [
      ...PAGE_ONE,
      ...PAGE_TWO,
    ];

    const secciones = paginas
      .map((section) => {
        const rows = (section.fields || [])
          .map((rawField) => {
            const field = normalizePrintField(rawField);

            return `
              <div class="field">
                <span class="field-label">
                  ${escapePrintHtml(field.label)}
                </span>
                <span class="field-value">
                  ${escapePrintHtml(getPrintValue(rawField))}
                </span>
              </div>
            `;
          })
          .join("");

        return `
          <section class="report-section">
            <h2>
              ${escapePrintHtml(
                section.title?.[idioma] ||
                section.title?.es ||
                ""
              )}
            </h2>
            <div class="fields">${rows}</div>
          </section>
        `;
      })
      .join("");

    const firmaValida =
      String(form.firmaCliente || "").startsWith("data:image/")
        ? form.firmaCliente
        : "";

    return `<!doctype html>
<html lang="${idioma}">
<head>
  <meta charset="utf-8" />
  <title>${escapePrintHtml(
    form.numeroInforme || "START-UP"
  )}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 8px;
      color: #0f172a;
      background: white;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8px;
      line-height: 1.15;
    }
    .header {
      border: 2px solid #0f172a;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 5px;
    }
    .brand {
      padding: 7px 10px;
      color: white;
      background: linear-gradient(135deg, #020617, #172554, #0e7490);
    }
    .brand small {
      display: block;
      color: #67e8f9;
      font-weight: 800;
      letter-spacing: 2px;
    }
    .brand h1 {
      margin: 2px 0 1px;
      font-size: 15px;
    }
    .brand p { margin: 0; opacity: .75; }
    .meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    .meta div {
      min-height: 29px;
      padding: 4px 6px;
      border-top: 1px solid #cbd5e1;
    }
    .meta div:not(:nth-child(3n + 1)) {
      border-left: 1px solid #cbd5e1;
    }
    .meta label, .field-label {
      display: block;
      margin-bottom: 3px;
      color: #64748b;
      font-size: 6px;
      font-weight: 800;
      letter-spacing: .55px;
      text-transform: uppercase;
    }
    .meta strong { font-size: 8px; }
    .report-section {
      margin-bottom: 4px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      break-inside: auto;
      overflow: hidden;
    }
    .report-section h2 {
      margin: 0;
      padding: 3px 6px;
      color: white;
      background: #172554;
      font-size: 8px;
    }
    .fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    .field {
      min-height: 20px;
      padding: 3px 5px;
      border-top: 1px solid #e2e8f0;
    }
    .field:not(:nth-child(3n + 1)) {
      border-left: 1px solid #e2e8f0;
    }
    .field-value {
      display: block;
      font-weight: 700;
      white-space: pre-wrap;
    }
    .signature {
      page-break-inside: avoid;
      margin-top: 5px;
      padding: 6px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      break-inside: avoid;
    }
    .signature img {
      display: block;
      max-width: 300px;
      max-height: 70px;
      margin-top: 3px;
      object-fit: contain;
    }
    .footer {
      margin-top: 4px;
      color: #64748b;
      text-align: center;
      font-size: 6px;
    }
    @page { size: letter portrait; margin: 6mm; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="brand">
      <small>HVAC MALDONADO</small>
      <h1>${escapePrintHtml(copy.title)}</h1>
      <p>${escapePrintHtml(copy.subtitle)} · ${escapePrintHtml(
        form.numeroInforme || "START-UP"
      )}</p>
    </div>

    <div class="meta">
      <div>
        <label>${escapePrintHtml(copy.date)}</label>
        <strong>${escapePrintHtml(form.fecha || "—")}</strong>
      </div>
      <div>
        <label>${escapePrintHtml(copy.customer)}</label>
        <strong>${escapePrintHtml(form.clienteNombre || "—")}</strong>
      </div>
      <div>
        <label>${escapePrintHtml(copy.address)}</label>
        <strong>${escapePrintHtml(form.direccionTrabajo || "—")}</strong>
      </div>
      <div>
        <label>${escapePrintHtml(copy.building)} / ${escapePrintHtml(copy.apartment)}</label>
        <strong>${escapePrintHtml([
          form.datos?.building,
          form.datos?.apartment,
        ].filter(Boolean).join(" · ") || "—")}</strong>
      </div>
      <div>
        <label>${escapePrintHtml(copy.contractor)}</label>
        <strong>${escapePrintHtml(
          form.contratistaInstalador || "HVAC Maldonado"
        )}</strong>
      </div>
      <div>
        <label>${escapePrintHtml(copy.technician)}</label>
        <strong>${escapePrintHtml(form.tecnicoNombre || "—")}</strong>
      </div>
    </div>
  </header>

  ${secciones}

  <section class="signature">
    <strong>${escapePrintHtml(copy.signature)}</strong>
    <p>${escapePrintHtml(form.nombreFirmante || "—")}</p>
    ${firmaValida
      ? `<img src="${firmaValida}" alt="Signature" />`
      : ""}
    <p>${escapePrintHtml(form.firmadoAt || "")}</p>
  </section>

  <div class="footer">
    HVAC Maldonado · ${escapePrintHtml(
      form.numeroInforme || "START-UP"
    )}
  </div>
</body>
</html>`;
  };

  const imprimirInforme = () => {
    const popup = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!popup) {
      alert(copy.popupBlocked);
      return;
    }

    popup.document.open();
    popup.document.write(generarDocumentoImprimible());
    popup.document.close();

    popup.addEventListener(
      "load",
      () => {
        setTimeout(() => {
          popup.focus();
          popup.print();
        }, 250);
      },
      { once: true }
    );
  };

  const compartirInforme = async () => {
    const titulo = `${copy.title} ${
      form.numeroInforme || ""
    }`.trim();

    const resumen = [
      titulo,
      `${copy.customer}: ${form.clienteNombre || "—"}`,
      `${copy.address}: ${form.direccionTrabajo || "—"}`,
      `${copy.technician}: ${form.tecnicoNombre || "—"}`,
      `${copy.date}: ${form.fecha || "—"}`,
    ].join("\n");

    try {
      const html = generarDocumentoImprimible();
      const file = new File(
        [html],
        `${form.numeroInforme || "START-UP"}.html`,
        { type: "text/html" }
      );

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: titulo,
          text: resumen,
          files: [file],
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: titulo,
          text: resumen,
        });
        return;
      }

      window.location.href =
        `mailto:?subject=${encodeURIComponent(titulo)}` +
        `&body=${encodeURIComponent(resumen)}`;
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(
          "Error compartiendo informe Start-Up:",
          error
        );
        alert(copy.shareFailed);
      }
    }
  };

  const sections = page === 1 ? PAGE_ONE : PAGE_TWO;

  return (
    <div className="fixed inset-0 z-[996] overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md">
      <div className="mx-auto min-h-full max-w-7xl rounded-[1.5rem] bg-slate-100 shadow-2xl">
        <header className="sticky top-0 z-40 rounded-t-[1.5rem] border-b border-white/10 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 p-3 text-white shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-300/30">
                <ClipboardCheck size={25} className="text-cyan-200" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
                  {form.numeroInforme || "START-UP"}
                </p>
                <h2 className="truncate text-xl font-black">{copy.title}</h2>
                <p className="text-xs font-bold text-white/60">{copy.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={
                "rounded-full px-3 py-1.5 text-xs font-black " +
                (form.estado === "firmado"
                  ? "bg-emerald-400/20 text-emerald-100"
                  : "bg-amber-400/20 text-amber-100")
              }>
                {form.estado === "firmado" ? copy.signed : copy.draft}
              </span>

              <button
                type="button"
                disabled={readOnly}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    idioma: current.idioma === "en" ? "es" : "en",
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-black disabled:opacity-50"
              >
                <Languages size={15} />
                {idioma === "en" ? "ES" : "EN"}
              </button>

              <button
                type="button"
                onClick={imprimirInforme}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 shadow-sm"
              >
                <Printer size={15} />
                {copy.print}
              </button>

              <button
                type="button"
                onClick={compartirInforme}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white ring-1 ring-white/15"
              >
                <Share2 size={15} />
                {copy.share}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-950"
              >
                <X size={15} />
                {copy.close}
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-3 p-3">
          {readOnly && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-black text-amber-900">
              {copy.readOnly}
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
            <div className="grid border-b border-slate-200 md:grid-cols-[0.7fr_1.5fr] md:divide-x md:divide-slate-200">
              <div className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-3 px-4 py-3">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.date}
                </span>
                <span className="min-w-0 font-black text-slate-950">
                  {form.fecha || "—"}
                </span>
              </div>

              <div className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-3 border-t border-slate-200 px-4 py-3 md:border-t-0">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.customer}
                </span>
                <span className="min-w-0 break-words font-black text-slate-950">
                  {form.clienteNombre || "—"}
                </span>
              </div>
            </div>

            <div className="grid border-b border-slate-200 md:grid-cols-[2fr_0.7fr_0.8fr_1fr] md:divide-x md:divide-slate-200">
              <div className="min-w-0 px-4 py-3">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.address}
                </span>
                <span className="block min-w-0 break-words font-bold text-slate-950">
                  {form.direccionTrabajo || "—"}
                </span>
              </div>

              <div className="min-w-0 border-t border-slate-200 px-4 py-3 md:border-t-0">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.building}
                </span>
                <span className="block min-w-0 break-words font-bold text-slate-950">
                  {form.datos?.building || "—"}
                </span>
              </div>

              <div className="min-w-0 border-t border-slate-200 px-4 py-3 md:border-t-0">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.apartment}
                </span>
                <span className="block min-w-0 break-words font-bold text-slate-950">
                  {form.datos?.apartment || "—"}
                </span>
              </div>

              <div className="min-w-0 border-t border-slate-200 px-4 py-3 md:border-t-0">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.phone}
                </span>
                <span className="block min-w-0 break-words font-bold text-slate-950">
                  {form.datos?.customerPhone || "—"}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:divide-x md:divide-slate-200">
              <div className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-3 px-4 py-3">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.contractor}
                </span>
                <span className="min-w-0 break-words font-black text-slate-950">
                  {form.contratistaInstalador || "HVAC Maldonado"}
                </span>
              </div>

              <div className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-3 border-t border-slate-200 px-4 py-3 md:border-t-0">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {copy.technician}
                </span>
                <span className="min-w-0 break-words font-black text-slate-950">
                  {form.tecnicoNombre || "—"}
                </span>
              </div>
            </div>
          </section>

          <nav className="grid grid-cols-3 gap-1.5 rounded-xl bg-white p-1.5 shadow-sm">
            {[
              [1, copy.page1],
              [2, copy.page2],
              [3, copy.signaturePage],
            ].map(([number, label]) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                className={
                  "rounded-xl px-3 py-2 text-xs font-black transition " +
                  (page === number
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-600")
                }
              >
                {label}
              </button>
            ))}
          </nav>

          {page !== 3 ? (
            <div className="space-y-3">
              {sections.map((section) => (
                <ReportSection
                  key={section.id}
                  section={section}
                  idioma={idioma}
                  datos={form.datos || {}}
                  update={updateData}
                  disabled={readOnly}
                />
              ))}
            </div>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Signature size={24} className="text-blue-700" />
                <div>
                  <h3 className="text-lg font-black text-slate-950">{copy.signature}</h3>
                  <p className="text-sm font-semibold text-slate-500">{copy.signatureHelp}</p>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {copy.signerName}
                </span>
                <input
                  value={form.nombreFirmante || ""}
                  disabled={readOnly}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nombreFirmante: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </label>

              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                className="mt-4 h-56 w-full touch-none rounded-2xl border-2 border-dashed border-slate-300 bg-white"
              />

              {!readOnly && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-700"
                >
                  <Eraser size={15} />
                  {copy.clear}
                </button>
              )}
            </section>
          )}

          <footer className="sticky bottom-2 z-30 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-black disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                {copy.previous}
              </button>

              <button
                type="button"
                disabled={page === 3}
                onClick={() => setPage((current) => Math.min(3, current + 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white disabled:opacity-40"
              >
                {copy.next}
                <ChevronRight size={15} />
              </button>
            </div>

            {!readOnly && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-black text-amber-900 disabled:opacity-50"
                >
                  <Save size={16} />
                  {copy.saveDraft}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2.5 text-sm font-black text-white shadow-lg disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  {copy.signSave}
                </button>
              </div>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
