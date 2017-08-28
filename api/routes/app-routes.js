
//--------------------> Exports
exports.app = app => {
    const controller = require('../controllers/route-controller');

    app.route('/app/access/:macAddress')
        .get(controller.verifyAccess);

    app.route('/app/key')
        .post(controller.registerKey);

    app.route('/admin/key')
        .post(controller.createKey);
    
    app.route('/admin/keys')
        .get(controller.getAllUsedKeys)
        .post(controller.getAllUnusedKeys);
}