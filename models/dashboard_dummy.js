const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dashboardDummySchema = mongoose.Schema({
    fullname: {
        type: String,
        required:true
    },
    posttime: {
        type: String,
        required:true
    },
    userimage:{
        type:String,
    },
    timelineStatus: {
        type: String,
        required:true
    }
    });


const Dashboard = mongoose.model('DashboardDummy',dashboardDummySchema);
module.exports = Dashboard;


