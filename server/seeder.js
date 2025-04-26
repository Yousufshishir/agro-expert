// server/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import crops from './data/crops.js';
import Crop from './models/Crop.js';

dotenv.config();

connectDB();

const importData = async() => {
    try {
        // Clear existing crops
        await Crop.deleteMany({});

        // Insert crops
        await Crop.insertMany(crops);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async() => {
    try {
        await Crop.deleteMany({});

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Run with argument: node seeder.js -d to destroy data
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}