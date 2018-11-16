import Ctrl from '../controllers/applications';

export default (router) => {
  router.get('/app', Ctrl.getApp);
};
