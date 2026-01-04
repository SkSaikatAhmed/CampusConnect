exports.addMeta = async (req, res) => {
    try {
      const { type, value, program, department } = req.body;
  
      if (!type || !value)
        return res.status(400).json({ message: "Invalid data" });
  
      const meta = await Meta.create({
        type,
        value,
        program: program || null,
        department: department || null,
      });
  
      res.json(meta);
    } catch (err) {
      res.status(400).json({ message: "Already exists" });
    }
  };
  