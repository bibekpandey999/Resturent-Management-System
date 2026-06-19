import mongoose, { Document } from "mongoose";
import { INGREDIENT_UNITS, TIngredientUnit } from "../utils/measuringUnits";

export interface IIngredient extends Document {
  name: string;
  unit: TIngredientUnit;
  currentStock: number;
  minimumStock: number;
  category?: string;
  isActive: boolean;
  lastStockInDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new mongoose.Schema<IIngredient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      enum: INGREDIENT_UNITS,
    },

    currentStock: {
      type: Number,
      default: 0,
    },

    minimumStock: {
      type: Number,
      default: 10,
    },

    category: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    lastStockInDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const IngredientModel = mongoose.model<IIngredient>(
  "Ingredient",
  ingredientSchema,
);

export default IngredientModel;
