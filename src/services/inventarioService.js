import { supabase } from "../lib/supabase";

function mapInventario(row) {
  return {
    id: row.id,
    nombre: row.nombre || "",
    sku: row.sku || "",
    categoria: row.categoria || "Otros",
    tipo: row.tipo || "Material consumible",
    unidad: row.unidad || "pieza",
    cantidad: Number(row.cantidad || 0),
    costo: Number(row.costo || 0),
    stockMinimo: Number(row.stock_minimo || 0),
    activo: row.activo !== false,
  };
}

export async function obtenerInventarioSupabase() {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapInventario);
}

export async function crearInventarioSupabase(item) {
  const { data, error } = await supabase
    .from("inventario")
    .insert({
      nombre: item.nombre || "",
      sku: item.sku || "",
      categoria: item.categoria || "Otros",
      tipo: item.tipo || "Material consumible",
      unidad: item.unidad || "pieza",
      cantidad: Number(item.cantidad || 0),
      costo: Number(item.costo || 0),
      stock_minimo: Number(item.stockMinimo || 0),
      activo: item.activo !== false,
    })
    .select()
    .single();

  if (error) throw error;
  return mapInventario(data);
}

export async function actualizarInventarioSupabase(id, cambios) {
  const payload = {};

  if ("nombre" in cambios) payload.nombre = cambios.nombre || "";
  if ("sku" in cambios) payload.sku = cambios.sku || "";
  if ("categoria" in cambios) payload.categoria = cambios.categoria || "Otros";
  if ("tipo" in cambios) payload.tipo = cambios.tipo || "Material consumible";
  if ("unidad" in cambios) payload.unidad = cambios.unidad || "pieza";
  if ("cantidad" in cambios) payload.cantidad = Number(cambios.cantidad || 0);
  if ("costo" in cambios) payload.costo = Number(cambios.costo || 0);
  if ("stockMinimo" in cambios) payload.stock_minimo = Number(cambios.stockMinimo || 0);
  if ("activo" in cambios) payload.activo = cambios.activo !== false;

  const { data, error } = await supabase
    .from("inventario")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapInventario(data);
}
