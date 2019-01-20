import { User } from './../users/users.model';
import { Restaurant } from './../restaurants/restaurants.model';
import * as mongoose from 'mongoose'

export interface Review extends mongoose.Document{
   date: Date,
   rating: number,
   comments: string,
   user: mongoose.Types.ObjectId | User
   restaurant: mongoose.Types.ObjectId | Restaurant,//runtime
   
}

const reviewSchema = new mongoose.Schema({
   date: {
       type: Date,
       required: true
   },
   rating: {
       type: Number,
       required: true,
       min: 1,
       max: 5
   }, 
   comments: {
       type: String,
       required: true,
       maxlength: 500
   },
   restaurant: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Restaurant',
       required: true,
   },
   user: {
        type: mongoose.Schema.Types.ObjectId, //propridade esquema
        ref: 'User',
        required: true,
    }
})

export const Review = mongoose.model<Review>('Review', reviewSchema)