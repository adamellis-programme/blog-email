const mongoose = require('mongoose')

// object of fields
const sendEmailSchema = mongoose.Schema(
  {
    to: {
      type: String,
      default: '',
    },

    from: {
      type: String,
      default: '',
    },

    subject: {
      type: String,
      default: '',
    },

    body: {
      type: String,
      default: '',
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('SentEmail', sendEmailSchema)
