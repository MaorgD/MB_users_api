const express = require("express");
const { toyCtrl } = require("../controllers/toyControll");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();
///toys
router.get("/", toyCtrl.getToy)
router.get("/toybyid/:userId", auth, toyCtrl.toyByUserId)
///toys/prices?min=70&max=200
router.get("/prices", toyCtrl.toysByPrice)
// /toys/search?s=
router.get("/search", toyCtrl.searchToy)
// /toys/category/{catname}
router.get("/category/:catName", toyCtrl.toyByCategory)
// /toys
router.post("/", auth, toyCtrl.addToy)
// /toys/{id_toy}
router.put("/:editId", auth, toyCtrl.editToy)
// /toys/{id_toy}                   
router.delete("/:delId", auth, toyCtrl.deleteToy)

module.exports = router;