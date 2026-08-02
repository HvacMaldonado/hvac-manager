import { supabase } from "../lib/supabase";

function mapInformeStartup(row) {
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
    contratistaInstalador:
      row.contratista_instalador || "HVAC Maldonado",

    datos:
      row.datos &&
      typeof row.datos === "object" &&
      !Array.isArray(row.datos)
        ? row.datos
        : {},

    nombreFirmante: row.nombre_firmante || "",
    firmaCliente: row.firma_cliente || "",
    firmadoAt: row.firmado_at || "",

    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function nullableUuid(value) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

function createPayload(informe) {
  return {
    orden_id: informe.ordenId,
    cliente_id: nullableUuid(informe.clienteId),
    direccion_id: nullableUuid(informe.ubicacionId),
    tecnico_id: nullableUuid(informe.tecnicoId),

    idioma: informe.idioma === "en" ? "en" : "es",
    estado:
      informe.estado === "firmado"
        ? "firmado"
        : "borrador",

    fecha:
      informe.fecha ||
      new Date().toISOString().slice(0, 10),

    cliente_nombre: informe.clienteNombre || "",
    direccion_trabajo: informe.direccionTrabajo || "",
    ubicacion_etiqueta: informe.ubicacionEtiqueta || "",
    tecnico_nombre: informe.tecnicoNombre || "",
    contratista_instalador:
      informe.contratistaInstalador ||
      "HVAC Maldonado",

    datos:
      informe.datos &&
      typeof informe.datos === "object" &&
      !Array.isArray(informe.datos)
        ? informe.datos
        : {},

    nombre_firmante: informe.nombreFirmante || "",
    firma_cliente: informe.firmaCliente || "",
    firmado_at: informe.firmadoAt || null,
  };
}

export async function obtenerInformesStartupSupabase() {
  const { data, error } = await supabase
    .from("informes_startup")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapInformeStartup);
}

export async function obtenerInformeStartupPorOrdenSupabase(
  ordenId
) {
  const { data, error } = await supabase
    .from("informes_startup")
    .select("*")
    .eq("orden_id", ordenId)
    .maybeSingle();

  if (error) throw error;

  return data ? mapInformeStartup(data) : null;
}

export async function crearBorradorInformeStartupSupabase(
  informe
) {
  const payload = createPayload({
    ...informe,
    estado: "borrador",
  });

  const { data, error } = await supabase
    .from("informes_startup")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapInformeStartup(data);
}

export async function actualizarInformeStartupSupabase(
  id,
  informe
) {
  const payload = createPayload(informe);

  const { data, error } = await supabase
    .from("informes_startup")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapInformeStartup(data);
}

export async function firmarInformeStartupSupabase(
  id,
  informe
) {
  return actualizarInformeStartupSupabase(id, {
    ...informe,
    estado: "firmado",
    firmadoAt:
      informe.firmadoAt ||
      new Date().toISOString(),
  });
}
