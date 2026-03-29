//shelfController.js
import EvidenceSchema from '../models/EvidenceSchema.js';
import ShelfSchema from '../models/shelfSchema.js';
// controller for handling shelf-related operations
const getShelves = async (req, res) => {
    try {
        const shelves = await ShelfSchema.find().sort({ createdAt: -1 });
        res.json(shelves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { getShelves };

export const getShelfById = async (req, res) => {
    try {
        const shelf = await ShelfSchema.findById(req.params.id);
        res.status(200).json(shelf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addShelf = async (req, res) => {
    const { shelfId, section, capacity, status } = req.body;
    try {
        const newShelf = new ShelfSchema({ shelfId, section, capacity, occupied: 0, status });
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
        const updatedShelf = await ShelfSchema.findOneAndUpdate(
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


export const linkEvidenceToShelf = async (req, res) => {
    const { evidenceId, shelf_id } = req.body;

    try {
        // 1. Find the evidence
        const evidence = await EvidenceSchema.findOne({ evidenceId });
        if (!evidence) return res.status(404).json({ success: false, message: 'Evidence not found' });

        // 2. Find the shelf
        const shelf = await ShelfSchema.findById(shelf_id);
        if (!shelf) return res.status(404).json({ success: false, message: 'Shelf not found' });

        // 3. Check if shelf is full
        if (shelf.occupied >= shelf.capacity) {
            return res.status(400).json({ success: false, message: 'Shelf is at maximum capacity' });
        }

        // 4. Update Evidence
        evidence.storedAt = shelf_id;
        evidence.status = 'active'; // or 'stored'
        await evidence.save();

        // 5. Increment Shelf Occupancy
        shelf.occupied = (shelf.occupied || 0) + 1;
        await shelf.save();

        res.status(200).json({
            success: true,
            message: 'Evidence linked to storage successfully',
            data: { evidence, shelf }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
