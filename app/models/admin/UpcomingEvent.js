let mongoose = require('mongoose');
let schema = mongoose.Schema;

let upcomingEvent = new schema({
    event_name: {type: String},
    event_date: {type: Date, default: Date.now()},
    event_desc: {type: String},
    event_host_by: {type: String},
    event_location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model("upcoming_events", upcomingEvent);
