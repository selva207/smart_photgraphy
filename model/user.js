const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto incrementing ID for the user
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true, // Ensure user_id is unique when creating new users
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensuring `phone_number` is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delete_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for soft deletion (0 = not deleted, 1 = deleted)
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set the current timestamp when a user is created
    },
  },
  {
    tableName: "users", // Name of the table
    hooks: {
      beforeValidate: async (user, options) => {
        // Only perform uniqueness check when `delete_at` is 0 (not deleted)
        if (user.delete_at === 0) {
          const checks = await Promise.all([
            // Only check user_id uniqueness if it's a new record or user_id is being updated
            user.isNewRecord || user.changed('user_id')
              ? User.count({ where: { user_id: user.user_id, delete_at: 0 } })
              : Promise.resolve(0),

            // Only check phone_number uniqueness if it's a new record or phone_number is being updated
            user.isNewRecord || user.changed('phone_number')
              ? User.count({ where: { phone_number: user.phone_number, delete_at: 0 } })
              : Promise.resolve(0)
          ]);

          // Check for conflicts in user_id or phone_number
          if (checks[0] > 0) {
            throw new Error("User ID must be unique.");
          }

          if (checks[1] > 0) {
            throw new Error("Phone number must be unique.");
          }
        }
      },
    },
  }
);

module.exports = User;
