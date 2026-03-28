//shelfController.js
import shelf from '../models/shelfSchema.js';
// controller for handling shelf-related operations
const getShelves = async (req, res) => {
    try {
        const shelves = await shelf.find().sort({ createdAt: -1 });
        res.json(shelves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { getShelves };

const addShelf = async (req, res) => {
    const { shelfId, section, capacity, status } = req.body;
    try {
        const newShelf = new shelf({ shelfId, section, capacity, occupied: 0, status });
        await newShelf.save();
        res.status(201).json(newShelf);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export { addShelf };

const uploadStatus = async (req, res) => {
    const { shelfId, newStatus } = req.body;
    try {
        const updatedShelf = await shelf.findOneAndUpdate(
            { shelfId: shelfId },
            { status: newStatus },
            { new: true }
        );
        if (!updatedShelf) {
            return res.status(404).json({ message: 'Shelf not found' });
        }
        res.json(updatedShelf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { uploadStatus };