import { supabase } from "../lib/supabase";

function mapFirma(row) {
  return {
    id: row.id,
    ordenId: row.orden_id || "",
    firmaCliente: row.url_firma || "",
    nombreCliente: row.nombre_cliente || "",
    calificacion: row.calificacion || 0,
    comentario: row.comentario || "",
    fechaFirmaCliente: row.created_at || "",
  };
}

export async function obtenerFirmasOrdenesSupabase() {
  const { data, error } = await supabase
    .from("orden_firmas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapFirma);
}

export async function guardarFirmaOrdenSupabase({ ordenId, firmaCliente, nombreCliente = "", calificacion = 0, comentario = "" }) {
  const { data, error } = await supabase
    .from("orden_firmas")
    .insert({
      orden_id: ordenId,
      url_firma: firmaCliente,
      nombre_cliente: nombreCliente,
      calificacion: Number(calificacion || 0),
      comentario: comentario || "",
    })
    .select()
    .single();

  if (error) throw error;
  return mapFirma(data);
}
