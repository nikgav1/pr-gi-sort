import User from '../models/User.js';

export const logTrash = async (req, res) => {
  try {
    const { userId } = req.user;
    const { trashName } = req.body;

    if (!trashName) {
      return res.status(400).json({ error: 'Trash name is required' });
    }

    // Validate if trashName is one of the defined categories
    if (
      ![
        'papp- ja paberpakend',
        'plast- ja metallpakend',
        'klaaspakend',
        'biojäätmed',
        'olmejäätmed',
      ].includes(trashName)
    ) {
      return res.status(400).json({ error: 'Invalid trash category' });
    }

    // Update the specific trash count
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { [`sortedTrash.${trashName}`]: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Trash logged successfully',
    });
  } catch (error) {
    console.error('Log trash error:', error);
    res.status(500).json({ error: 'Error logging trash' });
  }
};
