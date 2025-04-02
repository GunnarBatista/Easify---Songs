const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

const app = express();
const port = process.env.PORT || 5000; // Use a porta definida no .env ou 5000 por padrão

app.use(cors()); // Habilita o CORS para todas as origens (pode ser restringido em produção)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

require('dotenv').config();
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Adicione esta linha

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Rota para obter todas as músicas
app.get('/api/musicas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM musicas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar as músicas' });
  }
});

// Rota para criar uma nova música (exemplo)
app.post('/api/musicas', async (req, res) => {
    try {
        const { icone_artista, nome_musica, nome_artista, duracao_segundos } = req.body;
        const result = await pool.query(
            'INSERT INTO musicas (icone_artista, nome_musica, nome_artista, duracao_segundos) VALUES ($1, $2, $3, $4) RETURNING *',
            [icone_artista, nome_musica, nome_artista, duracao_segundos]
        );
        res.status(201).json(result.rows[0]); // Retorna a música criada
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a música' });
    }
});


app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});