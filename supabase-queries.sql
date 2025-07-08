-- ================================================
-- Queries úteis para monitorar o cache
-- Execute no SQL Editor do Supabase
-- ================================================

-- Ver todos os caches ativos
SELECT 
  cache_key,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at > NOW() THEN 'VÁLIDO'
    ELSE 'EXPIRADO'
  END as status,
  AGE(NOW(), created_at) as idade
FROM api_cache 
ORDER BY created_at DESC;

-- Ver cache específico do Steam
SELECT 
  cache_key,
  data->'profile'->>'personaname' as steam_name,
  data->>'totalGames' as total_games,
  expires_at,
  created_at
FROM api_cache 
WHERE cache_key LIKE 'steam:%';

-- Ver tamanho dos dados em cache
SELECT 
  cache_key,
  LENGTH(data::text) as tamanho_bytes,
  pg_size_pretty(LENGTH(data::text)) as tamanho_legivel,
  expires_at
FROM api_cache 
ORDER BY LENGTH(data::text) DESC;

-- Limpeza manual de cache expirado
DELETE FROM api_cache 
WHERE expires_at < NOW();

-- Estatísticas do guestbook
SELECT 
  COUNT(*) as total_mensagens,
  COUNT(DISTINCT github_username) as usuarios_unicos,
  COUNT(*) FILTER (WHERE is_developer = true) as desenvolvedores,
  DATE_TRUNC('day', created_at) as dia,
  COUNT(*) as mensagens_por_dia
FROM guestbook_entries 
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY dia DESC;
