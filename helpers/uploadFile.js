const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (
    files,
    validExtensions = ['png', 'jpg', 'jpeg', 'gif'],
    folder = ''
) => {
    return new Promise((resolve, reject) => {
        const { sampleFile } = files;
        const splittedName = sampleFile.name.split('.');
        const extension = splittedName[splittedName.length - 1];

        // validate extensions
        if (!validExtensions.includes(extension)) {
            return reject(
                `The ${extension} extension is not allowed, only the following extensions are accepted ${validExtensions}`
            );
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(
            __dirname,
            '../uploads/',
            folder,
            tempName
        );

        sampleFile.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(tempName);
        });
    });
};

module.exports = { uploadFile };
