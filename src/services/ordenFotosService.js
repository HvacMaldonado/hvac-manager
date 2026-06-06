import { supabase } from "../lib/supabase";

function mapFoto(row) {
  return {
    id: row.id,
    ordenId: row.orden_id || "",
    tipo: row.tipo || "",
    url: row.url || "",
    fechaCreacion: row.created_at || "",
  };
}

export async function obtenerFotosOrdenesSupabase() {
  const { data, error } = await supabase
    .from("orden_fotos")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapFoto);
}

export async function guardarFotoOrdenSupabase({ ordenId, tipo, url }) {
  const { data, error } = await supabase
    .from("orden_fotos")
    .insert({
      orden_id: ordenId,
      tipo,
      url,
    })
    .select()
    .single();

  if (error) throw error;
  return mapFoto(data);
}
