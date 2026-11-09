// server.js - Servidor Express Completo (Escola de Música & Instrumentos)
require('dotenv').config();
const express = require('express');
const supabase = require('./config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. Rota GET Global: Listar todos os cursos/aulas oferecidas
app.get('/cursos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cursos_musica')
      .select('*');

    if (error) {
      return res.status(500).json({ erro: 'Erro no banco de dados', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

// 2. Rota GET por ID com tratamento 404: Buscar um curso específico
app.get('/cursos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('cursos_musica')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Curso não foi encontrado' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha na busca do recurso' });
  }
});

// 3. Rota GET com filtro: Retornar apenas cursos de 'Guitarra'
app.get('/cursos/guitarra', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cursos_musica')
      .select('*')
      .eq('instrumento', 'Guitarra');

    if (error) {
      return res.status(500).json({ erro: 'Erro ao filtrar cursos', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno ao buscar cursos de guitarra' });
  }
});

// Inicialização da escuta do servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/cursos`);
});