// import express from 'express';
// import { protect, restrictTo } from '../middleware/auth.js';
// import { validate, createCategoryValidation } from '../middleware/validation.js';
// import {
//   createCategory,
//   getAllCategories,
//   getCategory,
//   updateCategory,
//   deleteCategory
// } from '../controllers/categoryController.js';

// const router = express.Router();

// // PUBLIC ROUTES
// router.get('/', getAllCategories);
// router.post('/', validate(createCategoryValidation), createCategory);

// // PROTECTED ROUTES
// router.get('/:id', getCategory);

// router.patch('/:id',
//   protect,
//   restrictTo('admin', 'manager'),
//   updateCategory
// );

// router.delete('/:id',
//   protect,
//   restrictTo('admin'),
//   deleteCategory
// );

// export default router;


// routes/categoryRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} from '../controllers/categoryController.js';

const router = express.Router();

// Protect all category routes
router.use(protect);

// Category routes
router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/stats')
  .get(getCategoryStats);

router.route('/:id')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;