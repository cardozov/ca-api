
//--------------------> Exports
exports.app = app => {
    const controller = require('../controllers/route-controller');

    app.route('/')
        .get((req, res) => {
            let stack = app._router.stack
                .filter(x => x.route)
                .map(c => { 
                    return {
                        path:c.route.path,
                        methods:c.route.methods
                    }
                })
            res.send(stack)
        })

    app.route('/app/access/:macAddress')
        .get(controller.verifyAccess);

    app.route('/app/key')
        .post(controller.registerKey);

    app.route('/admin/key')
        .post(controller.createKey);
    
    app.route('/admin/keys')
        .get(controller.getAllUsedKeys)
        .post(controller.getAllUnusedKeys)
        .delete(controller.dropDatabase);
}