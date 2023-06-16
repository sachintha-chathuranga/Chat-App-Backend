const { DataTypes } = require('sequelize');
const { db } = require('../config/db');

const User = db.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profil_pic: {
        type: DataTypes.STRING,
        defaultValue: "default.png"
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
});

const Message = db.define('message', {
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'

    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
});


User.hasMany(Message,{
    foreignKey: {
        name: 'sender_id'
    }
});

Message.belongsTo(User,{
    foreignKey: {
        name: 'sender_id'
    }
});

//keep sync with database table, if there not any table automatically creat
db.sync().then(() => {
    console.log("user table created");
}).catch((err) => {
    console.log("Error syncing the Useer table" + err);
});


module.exports = {User, Message};
