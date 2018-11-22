import Ctrl from '../controllers/applications';

export default (router) => {
  /**
   *
   * @apiVersion 1.0.0
   * @api {get} /app Request App information
   * @apiName GetApp
   * @apiGroup App
   *
   * @apiSuccess {String} _id id of entry in database.
   * @apiSuccess {String} App  Name of App.
   * @apiSuccess {String} Category Category of the App.
   */
  router.get('/app', Ctrl.getApp);

  /**
   * @api {get} /apps Request List of Apps
   * @apiName GetApps
   * @apiGroup Apps
   *
   * @apiSuccess {String} _id id of entry in database.
   * @apiSuccess {String} App  Name of App.
   * @apiSuccess {String} Category Category of the App.
   */
  router.get('/apps', Ctrl.getApps);
};
