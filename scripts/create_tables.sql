-- Criar tabela de coaches
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  plan VARCHAR DEFAULT 'gratuito',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  nome VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  telefone VARCHAR,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de sessões
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  titulo VARCHAR NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao INTEGER NOT NULL DEFAULT 60,
  notas TEXT,
  feedback_token VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  sessao_id UUID NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  progress_rating INTEGER NOT NULL CHECK (progress_rating BETWEEN 1 AND 5),
  comentario TEXT,
  resposta TEXT,
  resposta_data TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR NOT NULL,
  destinatario_id UUID NOT NULL,
  destinatario_tipo VARCHAR NOT NULL CHECK (destinatario_tipo IN ('coach', 'cliente')),
  conteudo TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_clientes_coach_id ON clientes(coach_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_coach_id ON sessoes(coach_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_cliente_id ON sessoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_coach_id ON feedbacks(coach_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_cliente_id ON feedbacks(cliente_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_sessao_id ON feedbacks(sessao_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_destinatario ON notificacoes(destinatario_id, destinatario_tipo);
