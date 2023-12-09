const Vegetable = require('../models/vegetable');

exports.getVegetables = async (req, res) => {
    try {
        // Mengambil semua data sayuran dari database
        const vegetables = await Vegetable.findAll();

        // Memformat respons dengan data sayuran yang diambil
        const formattedVegetables = vegetables.map((vegetable) => {
            return {
                image: vegetable.image,
                name: vegetable.name,
                carbs: vegetable.carbs,
                vitamins: vegetable.vitamins,
                calories: vegetable.calories,
                protein: vegetable.protein,
                benefits: vegetable.benefits
            };
        });

        // Mengirim respons dengan data sayuran yang diformat
        return res.status(200).json({
            status: true,
            vegetables: formattedVegetables
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};
