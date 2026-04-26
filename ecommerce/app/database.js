import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Mock para web (evita erro)
const db = isWeb
  ? {
      execAsync: async () => {},
      getAllAsync: async () => [],
      getFirstAsync: async () => null,
      runAsync: async () => ({ changes: 0, lastInsertRowId: 1 }),
    }
  : SQLite.openDatabaseSync('bookflow.db');


export const loginUser = async (email, senha) => {
  try {
    const user = await db.getFirstAsync(
      `SELECT * FROM tb_usuario
       WHERE email_usuario = ? AND senha_usuario = ?`,
      [email, senha]
    );

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ─────────────────────────────────────────────
// 📌 CRIAR BANCO
// ─────────────────────────────────────────────
export const initDatabase = async () => {
  try {
    await db.execAsync(`

      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS tb_usuario (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_usuario TEXT,
        email_usuario TEXT UNIQUE,
        senha_usuario TEXT,
        tipo_usuario TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tb_categoria (
        id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_categoria TEXT
      );

      CREATE TABLE IF NOT EXISTS tb_livro (
        id_livro INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo_livro TEXT,
        autor_livro TEXT,
        preco REAL,
        estoque INTEGER,
        capa_livro TEXT,
        id_categoria INTEGER,
        FOREIGN KEY (id_categoria) REFERENCES tb_categoria(id_categoria)
      );

      CREATE TABLE IF NOT EXISTS tb_pedido (
        id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
        valor_total REAL,
        data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
      );

    `);

    console.log('Banco criado com sucesso');
    return true;

  } catch (error) {
    console.error('Erro ao criar banco:', error);
    return false;
  }
};

export const createAdmin = async () => {
  try {
    await db.runAsync(`
      INSERT INTO tb_usuario (
        nome_usuario,
        email_usuario,
        senha_usuario,
        tipo_usuario
      )
      VALUES (?, ?, ?, ?)
    `, [
      'Admin',
      'admin@email.com',
      '123456',
      'admin'
    ]);

    console.log('Admin criado!');
  } catch (error) {
    console.log('Admin já existe');
  }
};

// ─────────────────────────────────────────────
// 📚 LIVROS (PRODUTOS)
// ─────────────────────────────────────────────
export const getAllLivros = async () => {
  try {
    return await db.getAllAsync(`SELECT * FROM tb_livro`);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const insertLivro = async (titulo, preco, estoque) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO tb_livro (titulo_livro, preco, estoque)
       VALUES (?, ?, ?)`,
      [titulo, preco, estoque]
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateLivro = async (id, titulo, preco, estoque) => {
  try {
    await db.runAsync(
      `UPDATE tb_livro
       SET titulo_livro = ?, preco = ?, estoque = ?
       WHERE id_livro = ?`,
      [titulo, preco, estoque, id]
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteLivro = async (id) => {
  try {
    await db.runAsync(
      `DELETE FROM tb_livro WHERE id_livro = ?`,
      [id]
    );
  } catch (error) {
    console.error(error);
  }
};


// ─────────────────────────────────────────────
// 👤 USUÁRIOS
// ─────────────────────────────────────────────
export const getAllUsuarios = async () => {
  try {
    return await db.getAllAsync(`SELECT * FROM tb_usuario`);
  } catch (error) {
    console.error(error);
    return [];
  }
};


// ─────────────────────────────────────────────
// 📦 PEDIDOS
// ─────────────────────────────────────────────
export const getAllPedidos = async () => {
  try {
    return await db.getAllAsync(`SELECT * FROM tb_pedido`);
  } catch (error) {
    console.error(error);
    return [];
  }
};


// ─────────────────────────────────────────────
// 📊 DASHBOARD
// ─────────────────────────────────────────────
export const getDashboardData = async () => {
  try {
    const usuarios = await db.getFirstAsync(
      `SELECT COUNT(*) as total FROM tb_usuario`
    );

    const livros = await db.getFirstAsync(
      `SELECT COUNT(*) as total FROM tb_livro`
    );

    const pedidos = await db.getFirstAsync(
      `SELECT COUNT(*) as total FROM tb_pedido`
    );

    const faturamento = await db.getFirstAsync(
      `SELECT SUM(valor_total) as total FROM tb_pedido`
    );

    return {
      usuarios: usuarios?.total || 0,
      livros: livros?.total || 0,
      pedidos: pedidos?.total || 0,
      faturamento: faturamento?.total || 0
    };

  } catch (error) {
    console.error('Erro no dashboard:', error);

    return {
      usuarios: 0,
      livros: 0,
      pedidos: 0,
      faturamento: 0
    };
  }
};


// ─────────────────────────────────────────────
// 🚀 EXPORT
// ─────────────────────────────────────────────
export default db;