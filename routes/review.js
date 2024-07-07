// const { Review } = require('../models/review');
// const { Product } = require('../models/product');
// const express = require("express");
// const router = express.Router({ mergeParams: true });

// router.post('/products/:productId/reviews', async (req, res, next) => {
//     try {
//       const { rating, comment } = req.body;
//       const product = await Product.findById(req.params.productId);

//       if (!product) {
//         return next(new Error('Product not found'));
//       }

//       const review = await Review.create({
//         rating,
//         comment,
//         user: req.user.id,
//         product: product.id,
//       });

//       product.reviews.push(review.id);

//       // Update the average rating
//       product.avgRating =
//         product.reviews.length > 0
//           ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
//             product.reviews.length
//           : 0;

//       await product.save();

//       res.status(201).json({
//         status: 'success',
//         data: {
//           review,
//         },
//       });
//     } catch (err) {
//       next(err);
//     }
//   })

// module.exports = router;