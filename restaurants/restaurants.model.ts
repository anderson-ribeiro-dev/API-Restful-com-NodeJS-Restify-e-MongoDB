
import * as mongoose from 'mongoose'


//array de subItem
export interface MenuItem extends mongoose.Document {
    name: string,
    price: number 
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}

//menuItem
const menuSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true          
   },

   price: {
       type: Number,
       required: true

   }

})

//Schema restaurants
const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
})

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema)