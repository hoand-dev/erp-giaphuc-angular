/* loại bỏ phần cảnh báo "Warning: Entry point contains deep imports" cho package 'devextreme-angular'. */
module.exports = {
    packages: {
        'devextreme-angular': {
            ignorableDeepImportMatchers: [/devextreme\//]
        }
    }
};