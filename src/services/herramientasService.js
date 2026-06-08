import { supabase } from "../lib/supabase";

function mapHerramienta(row) {
  return {
    id: row.id,
    nombre: row.nombre || "",
    descripcion: row.descripcion || "",
    tecnicoId: row.tecnico_id || "",
    cantidad: Number(row.cantidad || 1),
    estado: row.estado || "Disponible",
    notas: row.notas || "",
    activo: row.activo !== false,
    fechaAsignacion: row.fecha_asignacion || "",
  };
}

export async function obtenerHerramientasSupabase() {
  const { data, error } = await supabase
    .from("herramientas")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapHerramienta);
}

export async function crearHerramientaSupabase(item) {
  const { data, error } = await supabase
    .from("herramientas")
    .insert({
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      tecnico_id: item.tecnicoId || null,
      cantidad: Number(item.cantidad || 1),
      estado: item.estado || "Disponible",
      notas: item.notas || "",
      activo: item.activo !== false,
      fecha_asignacion: item.tecnicoId ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapHerramienta(data);
}

export async function actualizarHerramientaSupabase(id, cambios) {
  const payload = {};

  if ("nombre" in cambios) payload.nombre = cambios.nombre || "";
  if ("descripcion" in cambios) payload.descripcion = cambios.descripcion || "";
  if ("tecnicoId" in cambios) payload.tecnico_id = cambios.tecnicoId || null;
  if ("cantidad" in cambios) payload.cantidad = Number(cambios.cantidad || 1);
  if ("estado" in cambios) payload.estado = cambios.estado || "Disponible";
  if ("notas" in cambios) payload.notas = cambios.notas || "";
  if ("activo" in cambios) payload.activo = cambios.activo !== false;

  if ("tecnicoId" in cambios) {
    payload.fecha_asignacion = cambios.tecnicoId ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from("herramientas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapHerramienta(data);
}


export async function eliminarHerramientaSupabase(id) {
  const { data, error } = await supabase
    .from("herramientas")
    .update({ activo: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapHerramienta(data);
}
