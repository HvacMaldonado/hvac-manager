import { supabase } from "../lib/supabase";

function mapOrden(row) {
  const tecnicoAsignado = row.orden_tecnicos?.[0];

  return {
    id: row.id,
    clienteId: row.cliente_id || "",
    ubicacionId: row.direccion_id || "",
    direccionId: row.direccion_id || "",
    origenCitaId: row.cita_id || "",
    tecnicoId: tecnicoAsignado?.tecnico_id || "",
    problema: row.problema || "",
    prioridad: row.prioridad || "Media",
    estado: row.estado || "Asignada",
    fecha: row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
    fechaCreacion: row.created_at || "",
    fechaProgramada: row.fecha_programada || "",
    horaProgramada: row.hora_programada ? String(row.hora_programada).slice(0, 5) : "",
    horaEnRuta: row.hora_en_ruta || "",
    horaLlegada: row.hora_llegada || "",
    horaInicio: row.hora_inicio || "",
    horaCierre: row.hora_cierre || "",
    duracionHoras: row.duracion_horas || "",
    duracionTraslado: row.duracion_traslado || "",
    notasTecnico: row.notas_tecnico || "",
    cancelReason: row.cancel_reason || "",
    costoMateriales: row.costo_materiales || 0,
    costoTotal: row.costo_total || 0,
    precioCobrado: row.precio_cobrado || 0,
    inventarioDescontado: row.inventario_descontado || false,
    fechaCompletada: row.fecha_completada || "",
    materialesUsados: [],
    fotos: { antes: "", durante: "", despues: "" },
    historialAdmin: row.historial_admin || [],
  };
}

export async function obtenerOrdenesSupabase() {
  const { data, error } = await supabase
    .from("ordenes")
    .select("*, orden_tecnicos(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapOrden);
}

export async function crearOrdenSupabase(orden) {
  const { data, error } = await supabase
    .from("ordenes")
    .insert({
      cliente_id: orden.clienteId || null,
      direccion_id: orden.ubicacionId || orden.direccionId || null,
      cita_id: orden.origenCitaId || null,
      problema: orden.problema || "",
      prioridad: orden.prioridad || "Media",
      estado: orden.estado || "Asignada",
      fecha_programada: orden.fechaProgramada || null,
      hora_programada: orden.horaProgramada || null,
      notas_tecnico: orden.notasTecnico || "",
      cancel_reason: orden.cancelReason || "",
      costo_materiales: Number(orden.costoMateriales || 0),
      costo_total: Number(orden.costoTotal || 0),
      precio_cobrado: Number(orden.precioCobrado || 0),
      inventario_descontado: orden.inventarioDescontado || false,
    })
    .select()
    .single();

  if (error) throw error;

  if (orden.tecnicoId) {
    const { error: tecnicoError } = await supabase
      .from("orden_tecnicos")
      .insert({
        orden_id: data.id,
        tecnico_id: orden.tecnicoId,
        rol: "principal",
      });

    if (tecnicoError) throw tecnicoError;
  }

  return {
    ...mapOrden({ ...data, orden_tecnicos: orden.tecnicoId ? [{ tecnico_id: orden.tecnicoId }] : [] }),
    tecnicoId: orden.tecnicoId || "",
  };
}

export async function actualizarOrdenSupabase(id, cambios) {
  const payload = {};

  if ("clienteId" in cambios) payload.cliente_id = cambios.clienteId || null;

  if ("ubicacionId" in cambios) {
    payload.direccion_id = cambios.ubicacionId || null;
  } else if ("direccionId" in cambios) {
    payload.direccion_id = cambios.direccionId || null;
  }

  if ("origenCitaId" in cambios) payload.cita_id = cambios.origenCitaId || null;
  if ("problema" in cambios) payload.problema = cambios.problema || "";
  if ("prioridad" in cambios) payload.prioridad = cambios.prioridad || "Media";
  if ("estado" in cambios) payload.estado = cambios.estado || "Asignada";
  if ("fechaProgramada" in cambios) payload.fecha_programada = cambios.fechaProgramada || null;
  if ("horaProgramada" in cambios) payload.hora_programada = cambios.horaProgramada || null;
  if ("horaEnRuta" in cambios) payload.hora_en_ruta = cambios.horaEnRuta || null;
  if ("horaLlegada" in cambios) payload.hora_llegada = cambios.horaLlegada || null;
  if ("horaInicio" in cambios) payload.hora_inicio = cambios.horaInicio || null;
  if ("horaCierre" in cambios) payload.hora_cierre = cambios.horaCierre || null;
  if ("duracionHoras" in cambios) payload.duracion_horas = cambios.duracionHoras || null;
  if ("duracionTraslado" in cambios) payload.duracion_traslado = cambios.duracionTraslado || null;
  if ("notasTecnico" in cambios) payload.notas_tecnico = cambios.notasTecnico || "";
  if ("cancelReason" in cambios) payload.cancel_reason = cambios.cancelReason || "";
  if ("costoMateriales" in cambios) payload.costo_materiales = Number(cambios.costoMateriales || 0);
  if ("costoTotal" in cambios) payload.costo_total = Number(cambios.costoTotal || 0);
  if ("precioCobrado" in cambios) payload.precio_cobrado = Number(cambios.precioCobrado || 0);
  if ("inventarioDescontado" in cambios) payload.inventario_descontado = cambios.inventarioDescontado || false;
  if ("fechaCompletada" in cambios) payload.fecha_completada = cambios.fechaCompletada || null;
  if ("historialAdmin" in cambios) payload.historial_admin = cambios.historialAdmin || [];

  if (Object.keys(payload).length > 0) {
    const { error } = await supabase
      .from("ordenes")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
  }

  // La asignación del técnico vive en orden_tecnicos,
  // no directamente en la tabla ordenes.
  if ("tecnicoId" in cambios) {
    const tecnicoId = cambios.tecnicoId ? String(cambios.tecnicoId) : "";

    if (tecnicoId) {
      const { data: asignaciones, error: buscarError } = await supabase
        .from("orden_tecnicos")
        .select("id")
        .eq("orden_id", String(id))
        .eq("rol", "principal")
        .limit(1);

      if (buscarError) throw buscarError;

      if (asignaciones && asignaciones.length > 0) {
        const { error: actualizarTecnicoError } = await supabase
          .from("orden_tecnicos")
          .update({ tecnico_id: tecnicoId })
          .eq("id", asignaciones[0].id);

        if (actualizarTecnicoError) throw actualizarTecnicoError;
      } else {
        const { error: insertarTecnicoError } = await supabase
          .from("orden_tecnicos")
          .insert({
            orden_id: String(id),
            tecnico_id: tecnicoId,
            rol: "principal",
          });

        if (insertarTecnicoError) throw insertarTecnicoError;
      }
    } else {
      const { error: quitarTecnicoError } = await supabase
        .from("orden_tecnicos")
        .delete()
        .eq("orden_id", String(id))
        .eq("rol", "principal");

      if (quitarTecnicoError) throw quitarTecnicoError;
    }
  }

  const { data, error } = await supabase
    .from("ordenes")
    .select("*, orden_tecnicos(*)")
    .eq("id", id)
    .single();

  if (error) throw error;

  return mapOrden(data);
}


export async function eliminarOrdenSupabase(id) {
  const ordenId = String(id);

  const tablasRelacionadas = [
    "orden_materiales",
    "orden_fotos",
    "orden_firmas",
    "orden_tecnicos",
  ];

  for (const tabla of tablasRelacionadas) {
    const { error } = await supabase
      .from(tabla)
      .delete()
      .eq("orden_id", ordenId);

    if (error) throw error;
  }

  const { error } = await supabase
    .from("ordenes")
    .delete()
    .eq("id", ordenId);

  if (error) throw error;

  return true;
}
