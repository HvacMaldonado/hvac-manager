import { supabase } from "../lib/supabase";

export async function obtenerTecnicosSupabase() {
  const { data, error } = await supabase
    .from("tecnicos")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((tecnico) => ({
    id: tecnico.id,
    nombre: tecnico.nombre || "",
    usuario: tecnico.usuario || "",
    password: tecnico.password || "1234",
    telefono: tecnico.telefono || "",
    email: tecnico.email || "",
    direccion: tecnico.direccion || "",
    fechaIngreso: tecnico.fecha_ingreso || "",
    fechaSalida: tecnico.fecha_salida || "",
    pagoHora: tecnico.pago_hora || 0,
    colorTema: tecnico.color_tema || "",
    activo: tecnico.activo !== false,
  }));
}

export async function crearTecnicoSupabase(tecnico) {
  const { data, error } = await supabase
    .from("tecnicos")
    .insert({
      nombre: tecnico.nombre,
      usuario: tecnico.usuario,
      password: tecnico.password || "1234",
      telefono: tecnico.telefono || "",
      email: tecnico.email || "",
      direccion: tecnico.direccion || "",
      fecha_ingreso: tecnico.fechaIngreso || null,
      fecha_salida: tecnico.fechaSalida || null,
      pago_hora: Number(tecnico.pagoHora || tecnico.pago_hora || 0),
      color_tema: tecnico.colorTema || tecnico.color_tema || "",
      activo: tecnico.activo !== false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nombre: data.nombre || "",
    usuario: data.usuario || "",
    password: data.password || "1234",
    telefono: data.telefono || "",
    email: data.email || "",
    direccion: data.direccion || "",
    fechaIngreso: data.fecha_ingreso || "",
    fechaSalida: data.fecha_salida || "",
    pagoHora: data.pago_hora || 0,
    colorTema: data.color_tema || "",
    activo: data.activo !== false,
  };
}

export async function actualizarTecnicoSupabase(id, cambios) {
  const payload = {};

  if ("nombre" in cambios) payload.nombre = cambios.nombre;
  if ("usuario" in cambios) payload.usuario = cambios.usuario;
  if ("password" in cambios) payload.password = cambios.password;
  if ("telefono" in cambios) payload.telefono = cambios.telefono;
  if ("email" in cambios) payload.email = cambios.email;
  if ("direccion" in cambios) payload.direccion = cambios.direccion;
  if ("fechaIngreso" in cambios) payload.fecha_ingreso = cambios.fechaIngreso || null;
  if ("fechaSalida" in cambios) payload.fecha_salida = cambios.fechaSalida || null;
  if ("pagoHora" in cambios) payload.pago_hora = Number(cambios.pagoHora || 0);
  if ("activo" in cambios) payload.activo = cambios.activo;

  const { data, error } = await supabase
    .from("tecnicos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
