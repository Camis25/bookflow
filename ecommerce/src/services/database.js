import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Mock para web (evita erro)
const db = isWeb
  ? {
      execAsync: async () => {},
      getAllAsync: async () => [],
      getFirstAsync: async () => null,
      runAsync: async () => ({
        changes: 0,
        lastInsertRowId: 1,
      }),
    }
  : SQLite.openDatabaseSync('bookflow.db');

// ─────────────────────────────────────────────
// 🔐 LOGIN
// ─────────────────────────────────────────────
export const loginUser = async (email, senha) => {
  try {
    const user = await db.getFirstAsync(
      `
      SELECT * FROM tb_usuario
      WHERE email_usuario = ?
      AND senha_usuario = ?
      `,
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

      PRAGMA foreign_keys = OFF;

      CREATE TABLE IF NOT EXISTS tb_usuario (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_usuario TEXT,
        email_usuario TEXT UNIQUE,
        senha_usuario TEXT,
        tipo_usuario TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        cpf TEXT,
        data_nascimento DATETIME,
        cidadeNasc TEXT,
        ultimaEscola TEXT
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

        FOREIGN KEY (id_categoria)
          REFERENCES tb_categoria(id_categoria)
      );

      CREATE TABLE IF NOT EXISTS tb_pedido (
        id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
        valor_total REAL,
        data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tb_favorito (
        id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,

        id_usuario INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_usuario)
          REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_livro)
          REFERENCES tb_livro(id_livro)
      );

      -- ─────────────────────────────
      -- 🛒 CARRINHO
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_carrinho (
        id_item_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        id_livro INTEGER,
        quantidade INTEGER DEFAULT 1,

        FOREIGN KEY (id_usuario)
          REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_livro)
          REFERENCES tb_livro(id_livro)
      );

      -- ─────────────────────────────
      -- 🛒 ITEM CARRINHO
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_item_carrinho (
        id_item_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,

        quantidade INTEGER,
        preco_unitario REAL,

        id_carrinho INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_carrinho)
          REFERENCES tb_carrinho(id_carrinho),

        FOREIGN KEY (id_livro)
          REFERENCES tb_livro(id_livro)
      );

      -- ─────────────────────────────
      -- 📦 STATUS
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_status (
        id_status INTEGER PRIMARY KEY AUTOINCREMENT,

        ds_status TEXT
      );

      -- ─────────────────────────────
      -- 📦 PEDIDOS
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_pedido (
        id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,

        valor_total REAL,

        data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,

        id_usuario INTEGER,
        id_endereco INTEGER,
        id_status INTEGER,

        FOREIGN KEY (id_usuario)
          REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_endereco)
          REFERENCES tb_endereco(id_endereco),

        FOREIGN KEY (id_status)
          REFERENCES tb_status(id_status)
      );

      -- ─────────────────────────────
      -- 📦 ITEM PEDIDO
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_item_pedido (
        id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,

        quantidade INTEGER,
        preco_unitario REAL,

        id_pedido INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_pedido)
          REFERENCES tb_pedido(id_pedido),

        FOREIGN KEY (id_livro)
          REFERENCES tb_livro(id_livro)
      );

      -- ─────────────────────────────
      -- 💳 PAGAMENTO
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_pagamento (
        id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,

        forma_pagamento TEXT,

        valor_total REAL,

        data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,

        id_usuario INTEGER,
        id_endereco INTEGER,
        id_status INTEGER,
        id_pedido INTEGER,

        FOREIGN KEY (id_usuario)
          REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_endereco)
          REFERENCES tb_endereco(id_endereco),

        FOREIGN KEY (id_status)
          REFERENCES tb_status(id_status),

        FOREIGN KEY (id_pedido)
          REFERENCES tb_pedido(id_pedido)
      );

      -- ─────────────────────────────
      -- ⭐ AVALIAÇÕES
      -- ─────────────────────────────
      CREATE TABLE IF NOT EXISTS tb_avaliacao (
        id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,

        nota INTEGER,

        comentario TEXT,

        data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,

        id_pedido INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_pedido)
          REFERENCES tb_pedido(id_pedido),

        FOREIGN KEY (id_livro)
          REFERENCES tb_livro(id_livro)
      );

    `);

    console.log('Banco criado com sucesso');

    return true;
  } catch (error) {
    console.error('Erro ao criar banco:', error);

    return false;
  }
};

// ─────────────────────────────────────────────
// 👑 ADMIN
// ─────────────────────────────────────────────
export const createAdmin = async () => {
  try {
    await db.runAsync(
      `
      INSERT INTO tb_usuario (
        nome_usuario,
        email_usuario,
        senha_usuario,
        tipo_usuario
      )

      VALUES (?, ?, ?, ?)
      `,
      [
        'Admin',
        'admin@email.com',
        '123456',
        'admin',
      ]
    );

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
    return await db.getAllAsync(`
      SELECT
        l.id_livro,
        l.titulo_livro,
        l.preco,
        l.capa_livro,
        c.nome_categoria as categoria

      FROM tb_livro l

      LEFT JOIN tb_categoria c
        ON l.id_categoria = c.id_categoria
    `);
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const insertLivro = async (
  titulo,
  preco,
  estoque,
  categoria,
  imagem
) => {
  await db.runAsync(
    `
    INSERT INTO tb_livro (
      titulo_livro,
      preco,
      estoque,
      id_categoria,
      capa_livro
    )

    VALUES (?, ?, ?, ?, ?)
    `,
    [
      titulo,
      preco,
      estoque,
      categoria,
      imagem,
    ]
  );
};

export const updateLivro = async (
  id,
  titulo,
  preco,
  estoque,
  id_categoria
) => {
  try {
    await db.runAsync(
      `
      UPDATE tb_livro

      SET
        titulo_livro = ?,
        preco = ?,
        estoque = ?,
        id_categoria = ?

      WHERE id_livro = ?
      `,
      [
        titulo,
        preco,
        estoque,
        id_categoria,
        id,
      ]
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteLivro = async (id) => {
  try {
    await db.runAsync(
      `
      DELETE FROM tb_livro
      WHERE id_livro = ?
      `,
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
    return await db.getAllAsync(`
      SELECT * FROM tb_usuario
    `);
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const deleteUsuario = async (id) => {
  try {
    const result = await db.runAsync(
      `
      DELETE FROM tb_usuario
      WHERE id_usuario = ?
      AND tipo_usuario != 'admin'
      `,
      [id]
    );

    if (result.changes === 0) {
      throw new Error(
        'Não é possível excluir um administrador.'
      );
    }

    return result;
  } catch (error) {
    console.error(
      'Erro ao deletar usuário:',
      error
    );

    throw error;
  }
};

export const createUsuario = async (
  nome,
  cpf,
  dataNascimento,
  email,
  senha,
  cidadeNasc,
  ultimaEscola
) => {
  try {
    await db.runAsync(
      `
      INSERT INTO tb_usuario (
        nome_usuario,
        cpf,
        data_nascimento,
        email_usuario,
        senha_usuario,
        tipo_usuario,
        cidadeNasc,
        ultimaEscola
      )

      VALUES (?, ?, ?, ?, ?, 'user', ?, ?)
      `,
      [
        nome,
        cpf,
        dataNascimento,
        email,
        senha,
        cidadeNasc,
        ultimaEscola,
      ]
    );

    console.log('Usuário criado:', {
      senha,
      email,
    });
  } catch (error) {
    console.error(
      'Erro ao criar usuário:',
      error
    );

    throw error;
  }
};


// ─────────────────────────────────────────────
// 🛒 CARRINHO
// ─────────────────────────────────────────────

// Buscar carrinho do usuário
export const getCarrinhoByUsuario = async (id_usuario) => {
  try {

    return await db.getAllAsync(
      `
      SELECT
        c.id_item_carrinho,
        c.quantidade,

        l.id_livro,
        l.titulo_livro,
        l.autor_livro,
        l.preco AS preco_unitario,
        l.capa_livro

      FROM tb_carrinho c

      INNER JOIN tb_livro l
        ON c.id_livro = l.id_livro

      WHERE c.id_usuario = ?
      `,
      [id_usuario]
    );

  } catch (error) {

    console.error(
      'Erro ao buscar carrinho:',
      error
    );

    return [];
  }
};

// Adicionar item ao carrinho
export const addToCarrinho = async (
  id_usuario,
  id_livro,
  quantidade = 1
) => {
  try {

    // verifica se item já existe
    const itemExistente = await db.getFirstAsync(
      `
      SELECT *
      FROM tb_carrinho
      WHERE id_usuario = ?
      AND id_livro = ?
      `,
      [id_usuario, id_livro]
    );

    // se existir -> soma quantidade
    if (itemExistente) {

      await db.runAsync(
        `
        UPDATE tb_carrinho

        SET quantidade = quantidade + ?

        WHERE id_carrinho = ?
        `,
        [
          quantidade,
          itemExistente.id_carrinho,
        ]
      );

    } else {

      // se não existir -> cria
      await db.runAsync(
        `
        INSERT INTO tb_carrinho (
          id_usuario,
          id_livro,
          quantidade
        )

        VALUES (?, ?, ?)
        `,
        [
          id_usuario,
          id_livro,
          quantidade,
        ]
      );
    }

  } catch (error) {
    console.error(
      'Erro ao adicionar ao carrinho:',
      error
    );
  }
};

// Alterar quantidade
export const updateQuantidadeCarrinho = async (
  id_carrinho,
  quantidade
) => {
  try {

    await db.runAsync(
      `
      UPDATE tb_carrinho

      SET quantidade = ?

      WHERE id_carrinho = ?
      `,
      [
        quantidade,
        id_carrinho,
      ]
    );

  } catch (error) {
    console.error(
      'Erro ao atualizar quantidade:',
      error
    );
  }
};

// Remover item do carrinho
export const removeItemCarrinho = async (
  id_carrinho
) => {
  try {

    await db.runAsync(
      `
      DELETE FROM tb_carrinho
      WHERE id_carrinho = ?
      `,
      [id_carrinho]
    );

  } catch (error) {
    console.error(
      'Erro ao remover item:',
      error
    );
  }
};

// Limpar carrinho
export const clearCarrinho = async (
  id_usuario
) => {
  try {

    await db.runAsync(
      `
      DELETE FROM tb_carrinho
      WHERE id_usuario = ?
      `,
      [id_usuario]
    );

  } catch (error) {
    console.error(
      'Erro ao limpar carrinho:',
      error
    );
  }
};

// ─────────────────────────────────────────────
// 🗂️ CATEGORIAS
// ─────────────────────────────────────────────
export const getAllCategorias = async () => {
  try {
    return await db.getAllAsync(`
      SELECT *
      FROM tb_categoria
      ORDER BY nome_categoria
    `);
  } catch (error) {
    console.error(
      'Erro ao buscar categorias:',
      error
    );

    return [];
  }
};

export const insertCategoria = async (nome) => {
  try {
    await db.runAsync(
      `
      INSERT INTO tb_categoria (
        nome_categoria
      )

      VALUES (?)
      `,
      [nome]
    );
  } catch (error) {
    console.error(error);
  }
};

export const updateCategoria = async (
  id,
  nome
) => {
  try {
    await db.runAsync(
      `
      UPDATE tb_categoria

      SET nome_categoria = ?

      WHERE id_categoria = ?
      `,
      [nome, id]
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteCategoria = async (id) => {
  try {
    await db.runAsync(
      `
      DELETE FROM tb_categoria
      WHERE id_categoria = ?
      `,
      [id]
    );
  } catch (error) {
    console.error(error);
  }
};

// ─────────────────────────────────────────────
// 📦 PEDIDOS
// ─────────────────────────────────────────────
export const getAllPedidos = async () => {
  try {
    return await db.getAllAsync(`
      SELECT * FROM tb_pedido
    `);
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
    const usuarios = await db.getFirstAsync(`
      SELECT COUNT(*) as total
      FROM tb_usuario
    `);

    const livros = await db.getFirstAsync(`
      SELECT COUNT(*) as total
      FROM tb_livro
    `);

    const pedidos = await db.getFirstAsync(`
      SELECT COUNT(*) as total
      FROM tb_pedido
    `);

    const faturamento = await db.getFirstAsync(`
      SELECT SUM(valor_total) as total
      FROM tb_pedido
    `);

    return {
      usuarios: usuarios?.total || 0,
      livros: livros?.total || 0,
      pedidos: pedidos?.total || 0,
      faturamento: faturamento?.total || 0,
    };
  } catch (error) {
    console.error(
      'Erro no dashboard:',
      error
    );

    return {
      usuarios: 0,
      livros: 0,
      pedidos: 0,
      faturamento: 0,
    };
  }
};

// ─────────────────────────────────────────────
// 🚀 EXPORT
// ─────────────────────────────────────────────
export default db;