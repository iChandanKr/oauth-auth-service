import {
  DataTypes,
  Model,
} from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../config/database.js";
import type { AuthProvider } from "../types/user.type.js";

class User extends Model<
  InferAttributes<User, { omit: "createdAt" | "updatedAt" }>,
  InferCreationAttributes<User, { omit: "createdAt" | "updatedAt" }>
> {
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: CreationOptional<string | null>;
  declare email: string;
  declare password: CreationOptional<string | null>;
  declare googleId: CreationOptional<string | null>;
  declare provider: CreationOptional<AuthProvider>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name is required",
        },
      },
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "Email already exists",
      },
      validate: {
        notEmpty: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty",
        },
      },
    },

    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        name: "unique_google_id",
        msg: "Google account already linked",
      },
    },

    provider: {
      type: DataTypes.ENUM("local", "google"),
      defaultValue: "local",
      validate: {
        isIn: {
          args: [["local", "google"]],
          msg: "Provider must be local or google",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  },
);

export default User;
