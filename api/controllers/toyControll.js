const { ToyModel } = require("../models/toyModel");
const { validateToy } = require("../validation/toyValidation");

exports.toyCtrl = {
  searchToy: async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let queryS = req.query.s;
      let searchReg = new RegExp(queryS, "i")
      let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  getToy: async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let data = await ToyModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  toyByUserId: async (req, res) => {
    try {
      let userId = req.params.userId;
      let data;
      
     data = await ToyModel.find({ user_id: userId})
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  }
  ,
  toysByPrice: async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "price"
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
      let minP = req.query.min || 0;
      let maxP = req.query.max || 10000;

      let data = await ToyModel.find({ $and: [{ price: { $gte: minP } }, { price: { $lte: maxP } }] })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  toyByCategory: async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let catN = req.params.catName;
      let catReg = new RegExp(catN, "i")
      let data = await ToyModel.find({ category: catReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  addToy: async (req, res) => {
    let validBody = validateToy(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);
    try {
      let toy = new ToyModel(req.body);
      toy.user_id = req.tokenData._id;
      await toy.save();
      res.status(201).json(toy);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  editToy: async (req, res) => {
    let validBody = validateToy(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);
    try {
      let editId = req.params.editId;
      let data;
      if (req.tokenData.role == "admin") data = await ToyModel.updateOne({ _id: editId }, req.body)
      else data = await ToyModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },
  deleteToy: async (req, res) => {
    try {
      let delId = req.params.delId;
      let data;
      if (req.tokenData.role == "admin") data = await ToyModel.deleteOne({ _id: delId })
      else data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  }
};