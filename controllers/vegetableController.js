const Vegetable = require('../models/vegetable');

exports.getVegetables = async (req, res) => {
    try {
        const vegetables = await Vegetable.findAll();

        const formattedVegetables = vegetables.map((vegetable) => {
            return {
                id: vegetable.id,
                image: vegetable.image,
                name: vegetable.name,
                carbs: vegetable.carbs,
                vitamins: vegetable.vitamins,
                calories: vegetable.calories,
                protein: vegetable.protein,
                benefits: vegetable.benefits
            };
        });

        return res.status(200).json({
            status: true,
            message: "Data retrieved successfully.",
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

exports.getVegetableById = async (req, res) => {
    const vegetableId = req.params.vegetableId;

    try {
        const vegetable = await Vegetable.findByPk(vegetableId);

        if (!vegetable) {
            return res.status(404).json({
                status: false,
                message: 'Vegetable not found'
            });
        }

        const formattedVegetable = {
            id: vegetable.id,
            name: vegetable.name,
            image: vegetable.image,
            carbs: vegetable.carbs,
            vitamins: vegetable.vitamins,
            calories: vegetable.calories,
            protein: vegetable.protein,
            benefits: vegetable.benefits
        };

        return res.status(200).json({
            status: true,
            message: "Data retrieved successfully.",
            vegetable: formattedVegetable
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};