-- ================================================
-- Supabase Schema Setup para Portfolio
-- Execute este script no SQL Editor do Supabase
-- ================================================

-- Tabela para cache de APIs
CREATE TABLE IF NOT EXISTS api_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para guestbook
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  username VARCHAR(50),
  is_developer BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- Políticas para guestbook (leitura pública, escrita permitida)
DROP POLICY IF EXISTS "Permitir leitura pública do guestbook" ON guestbook_entries;
CREATE POLICY "Permitir leitura pública do guestbook" ON guestbook_entries
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção no guestbook" ON guestbook_entries;
CREATE POLICY "Permitir inserção no guestbook" ON guestbook_entries
  FOR INSERT WITH CHECK (true);

-- Políticas para cache (acesso público para leitura e escrita via anon key)
DROP POLICY IF EXISTS "Cache leitura pública" ON api_cache;
CREATE POLICY "Cache leitura pública" ON api_cache
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cache escrita pública" ON api_cache;
CREATE POLICY "Cache escrita pública" ON api_cache
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cache update público" ON api_cache;
CREATE POLICY "Cache update público" ON api_cache
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Cache delete público" ON api_cache;
CREATE POLICY "Cache delete público" ON api_cache
  FOR DELETE USING (true);

-- Função para limpeza automática de cache expirado
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM api_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE api_cache IS 'Cache para armazenar dados de APIs externas (Steam, Last.fm, Lyfta)';
COMMENT ON TABLE guestbook_entries IS 'Entradas do livro de visitas do portfolio';
COMMENT ON COLUMN guestbook_entries.username IS 'Username do GitHub ou Instagram dependendo do is_developer';
COMMENT ON COLUMN guestbook_entries.is_developer IS 'Indica se a pessoa é desenvolvedor (GitHub) ou visitante (Instagram)';
COMMENT ON COLUMN api_cache.cache_key IS 'Chave única do cache no formato service:type:id';
COMMENT ON COLUMN api_cache.data IS 'Dados em formato JSON do cache';
