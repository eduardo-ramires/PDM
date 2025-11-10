const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const PORT = 3000; // Porta do seu Banco de Dados

app.use(cors()); 
app.use(express.json()); 

// Altere os dados conforme a sua maquina
const dbConfig = {
    host: 'localhost',
    user: 'root', //Usuario do seu banco de dados
    password: 'Edududu@11062005', // Senha do seu banco de dados
    database: 'todo_ubi' // Nome do seu banco de dados
};

app.post('/api/tarefas', async (req, res) => {
    const { descricao, data_final, prioridade, status } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: 'A descrição da tarefa é obrigatória.' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const sql = 'INSERT INTO tarefas (descricao, data_final, prioridade, status) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [descricao, data_final || null, prioridade || 0, status || 0]);
        
        await connection.end();
        
        res.status(201).json({ 
            id: result.insertId,
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
    console.log('1. Rota GET /api/tarefas foi chamada.'); // LOG 1
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tarefas ORDER BY prioridade DESC');
        await connection.end();

        console.log('2. Dados recebidos do banco:', rows); // LOG 2
        res.json(rows);
    } catch (error) {
        console.error('3. ERRO na rota GET:', error); // LOG 3
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
});

app.put('/api/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, data_final, prioridade, status } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: 'A descrição não pode ser vazia.' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const sql = 'UPDATE tarefas SET descricao = ?, data_final = ?, prioridade = ?, status = ? WHERE id = ?';
        
        const [result] = await connection.execute(sql, [descricao, data_final, prioridade, status, id]);
        await connection.end();

        if (result.affectedRows === 0) {
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
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM tarefas WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada para exclusão.' });
        }

        res.status(204).send(); 
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ message: 'Erro no servidor ao tentar deletar a tarefa.' });
    }
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor da API rodando em http://localhost:${PORT} e na sua rede local.`);
});