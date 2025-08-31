const router = require("express").Router();
const { getSupplements, addSupplement, markIntake } = require("../controllers/supplementController");
const { authMiddleware } = require("../middleware/authMiddleware"); 

router.get("/", authMiddleware, getSupplements);
router.post("/", authMiddleware, addSupplement);
router.post("/:id/mark", authMiddleware, markIntake);

module.exports = router;
