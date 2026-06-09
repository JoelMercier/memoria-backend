-- ——— fichier : database\views\14_v_app_events_critical_view.sql

CREATE or replace VIEW v_app_events_critical AS
SELECT
  id_event,
  user_id,
  event_category,
  event_type,
  severity,
  message,
  created_at
FROM app_events
WHERE severity IN ('warning', 'error', 'critical');
