exports.test = (req, res) => {
  res.status(200).send(req.identity);
};

