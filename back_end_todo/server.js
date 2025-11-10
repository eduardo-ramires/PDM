const express = require('express');
const { Pool } = require('pg'); // MUDANÇA: Importa o 'pg'
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// MUDANÇA: Configuração do Pool do PostgreSQL
// O 'Pool' vai ler automaticamente a variável 'DATABASE_URL' do Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
    // Se estiver a rodar localmente, crie um .env com DATABASE_URL="postgres://seu_user:sua_senha@localhost:5432/seu_banco"
});


app.post('/api/tarefas', async (req, res) => {
    const { descricao, data_final, prioridade, status } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: 'A descrição da tarefa é obrigatória.' });
    }
    
    // MUDANÇA: Sintaxe SQL e placeholders ($1, $2, ...) e RETURNING id
    const sql = 'INSERT INTO tarefas (descricao, data_final, prioridade, status) VALUES ($1, $2, $3, $4) RETURNING id';
    
    try {
        const [result] = await pool.query(sql, [descricao, data_final || null, prioridade || 0, status || 0]);
        
        res.status(201).json({ 
            id: result.rows[0].id, // MUDANÇA: Pega o ID retornado
            descricao,
            data_final,
            prioridade,
            status 
        });
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ message: 'Erro no servidor ao tentar criar a tarefa.' });
    }
});

app.get('/api/tarefas', async (req, res) => {
    console.log('1. Rota GET /api/tarefas foi chamada.');
    try {
        // MUDANÇA: Usa o pool e 'query', o resultado está em 'rows'
        const result = await pool.query('SELECT * FROM tarefas ORDER BY prioridade DESC');
        
        console.log('2. Dados recebidos do banco:', result.rows);
        res.json(result.rows); // MUDANÇA: Envia result.rows
    } catch (error) {
        console.error('3. ERRO na rota GET:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
});

app.put('/api/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, data_final, prioridade, status } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: 'A descrição não pode ser vazia.' });
    }

    // MUDANÇA: Placeholders de $1 a $5
    const sql = 'UPDATE tarefas SET descricao = $1, data_final = $2, prioridade = $3, status = $4 WHERE id = $5';
        
    try {
        const result = await pool.query(sql, [descricao, data_final, prioridade, status, id]);

        // MUDANÇA: usa 'rowCount' em vez de 'affectedRows'
        if (result.rowCount === 0) { 
            return res.status(404).json({ message: 'Tarefa não encontrada para atualização.' });
        }

        res.json({ id: Number(id), descricao, data_final, prioridade, status });
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ message: 'Erro no servidor ao tentar atualizar a tarefa.' });
    }
});

app.delete('/api/tarefas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // MUDANÇA: Placeholder $1
        const result = await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
        
        // MUDANÇA: usa 'rowCount'
        if (result.rowCount === 0) { 
            return res.status(404).json({ message: 'Tarefa não encontrada para exclusão.' });
        }

        res.status(204).send(); 
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ message: 'Erro no servidor ao tentar deletar a tarefa.' });
    }
});

// Sem mudanças aqui
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});