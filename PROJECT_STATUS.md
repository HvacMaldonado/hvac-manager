# HVAC Manager - Estado actual

## Rama actual
traduccion-completa-ui

## Estado estable
- UI 100% bilingüe ES/EN.
- PDF/reporte cliente bilingüe.
- Regla operativa: técnico/admin escribe notas en el idioma del cliente.
- Proyecto cargando correctamente.
- Git limpio antes de iniciar nueva fase.

## Decisión tomada
No implementar traducción automática con OpenAI por ahora.

## Próxima fase
Migración completa a Supabase.

## Orden de trabajo
1. Migrar órdenes a Supabase.
2. Migrar inventario a Supabase.
3. Migrar herramientas a Supabase.
4. Migrar fotos a Supabase Storage.
5. Migrar firmas a Supabase Storage.
6. Conectar Dashboard final con datos reales.


## Migración Supabase completada y validada

Validado:
- Clientes
- Técnicos
- Citas
- Órdenes
- Inventario
- Herramientas
- Materiales de órdenes
- Fotos de órdenes
- Firmas de órdenes

Pruebas realizadas:
- Recarga fuerte conserva datos.
- Fotos de órdenes persisten.
- Firmas persisten después de completar orden y moverla a Historial.

## Siguiente fase
Dashboard Premium HVAC Manager

Etapas:
1. Métricas técnicos.
2. Operación.
3. Inventario.
4. Negocio.
