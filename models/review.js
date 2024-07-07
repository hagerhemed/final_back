// const mongoose = require('mongoose');

// const reviewSchema = mongoose.Schema(
//   {
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },
//     comment: {
//       type: String,
//       required: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// exports.Review = mongoose.model('Review', reviewSchema);