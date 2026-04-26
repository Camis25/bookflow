module.exports = (req, res, next) => {
    const userId = req.headers['x-user-id'];

    // Simples (modo acadêmico)
    if (!userId || userId != 1) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado (apenas admin)'
        });
    }

    next();
};