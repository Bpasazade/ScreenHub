exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = async (req, res) => {
  try {
    // Assuming you have user authentication implemented and a user ID is available in req.user
    const userId = req.user._id;

    // Use your database model and query to retrieve the user's data
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the company name and number of screens from the user's data
    const companyName = user.companyName;
    const numberOfScreens = user.numberOfScreens;

    // Return the company name and number of screens as a response
    return res.status(200).json({ companyName, numberOfScreens });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};