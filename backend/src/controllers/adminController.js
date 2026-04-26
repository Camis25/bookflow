// Simulando banco em memória (depois pode integrar com SQLite)
let products = [];

exports.createProduct = (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            success: false,
            message: 'Nome e preço são obrigatórios'
        });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price
    };

    products.push(newProduct);

    res.status(201).json({
        success: true,
        data: newProduct
    });
};

exports.getProducts = (req, res) => {
    res.json({
        success: true,
        data: products
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    const product = products.find(p => p.id == id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
        });
    }

    if (name) product.name = name;
    if (price) product.price = price;

    res.json({
        success: true,
        data: product
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    const index = products.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
        });
    }

    products.splice(index, 1);

    res.json({
        success: true,
        message: 'Produto removido'
    });
};