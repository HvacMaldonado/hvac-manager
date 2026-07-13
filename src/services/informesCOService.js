import { supabase } from "../lib/supabase";

function mapInformeCO(row) {
  return {
    id: row.id,
    numeroInforme: row.numero_informe || "",
    ordenId: row.orden_id || "",
    clienteId: row.cliente_id || "",
    ubicacionId: row.direccion_id || "",
    tecnicoId: row.tecnico_id || "",
    idioma: row.idioma || "es",
    estado: row.estado || "borrador",
    fecha: row.fecha || "",

    clienteNombre: row.cliente_nombre || "",
    direccionTrabajo: row.direccion_trabajo || "",
    ubicacionEtiqueta: row.ubicacion_etiqueta || "",
    tecnicoNombre: row.tecnico_nombre || "",

    equipo: row.equipo || "",
    modeloSerie: row.modelo_serie || "",

    medicionAmbiente: row.medicion_ambiente ?? "",
    medicionEquipo: row.medicion_equipo ?? "",
    medicionVentilacion: row.medicion_ventilacion ?? "",

    medicionOtrosActiva: Boolean(row.medicion_otros_activa),
    medicionOtrosDetalle: row.medicion_otros_detalle || "",
    medicionOtrosValor: row.medicion_otros_valor ?? "",

    alarmaActivada: Boolean(row.alarma_activada),
    inspeccionVisual: Boolean(row.inspeccion_visual),

    hallazgos: row.hallazgos || {},
    hallazgosOtrosActiva: Boolean(row.hallazgos_otros_activa),
    hallazgosOtros: row.hallazgos_otros || "",

    recomendaciones: row.recomendaciones || {},
    recomendacionesOtrosActiva: Boolean(
      row.recomendaciones_otros_activa
    ),
    recomendacionesOtros: row.recomendaciones_otros || "",

    observaciones: row.observaciones || "",

    firmaCliente: row.firma_cliente || "",
    nombreFirmante: row.nombre_firmante || "",
    firmadoAt: row.firmado_at || "",

    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function nullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function createPayload(informe) {
  return {
    orden_id: informe.ordenId,
    cliente_id: informe.clienteId || null,
    direccion_id: informe.ubicacionId || null,
    tecnico_id: String(informe.tecnicoId || ""),

    idioma: informe.idioma || "es",
    estado: informe.estado || "borrador",
    fecha: informe.fecha || new Date().toISOString().slice(0, 10),

    cliente_nombre: informe.clienteNombre || "",
    direccion_trabajo: informe.direccionTrabajo || "",
    ubicacion_etiqueta: informe.ubicacionEtiqueta || "",
    tecnico_nombre: informe.tecnicoNombre || "",

    equipo: informe.equipo || "",
    modelo_serie: informe.modeloSerie || "",

    medicion_ambiente: nullableNumber(informe.medicionAmbiente),
    medicion_equipo: nullableNumber(informe.medicionEquipo),
    medicion_ventilacion: nullableNumber(
      informe.medicionVentilacion
    ),

    medicion_otros_activa: Boolean(
      informe.medicionOtrosActiva
    ),
    medicion_otros_detalle:
      informe.medicionOtrosDetalle || "",
    medicion_otros_valor: nullableNumber(
      informe.medicionOtrosValor
    ),

    alarma_activada: Boolean(informe.alarmaActivada),
    inspeccion_visual: Boolean(informe.inspeccionVisual),

    hallazgos: informe.hallazgos || {},
    hallazgos_otros_activa: Boolean(
      informe.hallazgosOtrosActiva
    ),
    hallazgos_otros: informe.hallazgosOtros || "",

    recomendaciones: informe.recomendaciones || {},
    recomendaciones_otros_activa: Boolean(
      informe.recomendacionesOtrosActiva
    ),
    recomendaciones_otros:
      informe.recomendacionesOtros || "",

    observaciones: informe.observaciones || "",

    firma_cliente: informe.firmaCliente || "",
    nombre_firmante: informe.nombreFirmante || "",
    firmado_at: informe.firmadoAt || null,
  };
}

export async function obtenerInformesCOSupabase() {
  const { data, error } = await supabase
    .from("informes_co")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapInformeCO);
}

export async function obtenerInformeCOPorOrdenSupabase(ordenId) {
  const { data, error } = await supabase
    .from("informes_co")
    .select("*")
    .eq("orden_id", ordenId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapInformeCO(data) : null;
}

export async function crearBorradorInformeCOSupabase(informe) {
  const payload = createPayload({
    ...informe,
    estado: "borrador",
  });

  const { data, error } = await supabase
    .from("informes_co")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapInformeCO(data);
}

export async function actualizarInformeCOSupabase(id, informe) {
  const payload = createPayload(informe);

  const { data, error } = await supabase
    .from("informes_co")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapInformeCO(data);
}
