import { supabase } from "../lib/supabase";

function mapMaterial(row) {
  return {
    id: row.id,
    ordenId: row.orden_id || "",
    inventarioId: row.inventario_id || "",
    cantidad: Number(row.cantidad || 0),
    costoUnitario: Number(row.costo_unitario || 0),
  };
}

export async function crearOrdenMaterialSupabase(material) {
  const { data, error } = await supabase
    .from("orden_materiales")
    .insert({
      orden_id: material.ordenId,
      inventario_id: material.inventarioId || null,
      cantidad: Number(material.cantidad || 0),
      costo_unitario: Number(material.costoUnitario || 0),
    })
    .select()
    .single();

  if (error) throw error;
  return mapMaterial(data);
}

export async function actualizarOrdenMaterialSupabase(id, cambios) {
  const payload = {};

  if ("inventarioId" in cambios) payload.inventario_id = cambios.inventarioId || null;
  if ("cantidad" in cambios) payload.cantidad = Number(cambios.cantidad || 0);
  if ("costoUnitario" in cambios) payload.costo_unitario = Number(cambios.costoUnitario || 0);

  const { data, error } = await supabase
    .from("orden_materiales")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapMaterial(data);
}

export async function eliminarOrdenMaterialSupabase(id) {
  const { error } = await supabase
    .from("orden_materiales")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
