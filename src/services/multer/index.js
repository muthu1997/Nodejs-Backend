import multer from 'multer';
import path from 'path';

const documentStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../../assets/profiles'),
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

const testStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../../assets/tests'),
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

const instituteStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../../assets/instituteImage'),
    filename: function (req, file, callback) {
        var name = Date.now() + '_' + file.originalname;
        callback(null, name);
        global.imagename = name;
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

export const uploadProfiles = multer({
    storage: documentStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

export const testDocuments = multer({
    storage: testStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

export const instituteDocuments = multer({
    storage: instituteStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});