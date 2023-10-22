import '@/infra/common/global-imports';
import { Router } from '@/lib/web-server/routing';
import { webServer } from '@/init/web-servers/main';
// import { mainSocketsServer } from '@/init/sockets/main-sockets/sockets-server';

// webServer.start()
//   .then(result => console.log(`Web server (${result.prefix ?? '/'}) is listening on port ${result.port}`));
// mainSocketsServer.start();

const router = new Router();
router.register('GET', '/users/:userId', () => {});
router.register('GET', '/users/', () => {});
// router.register('GET', '/users/:id', () => {});
// console.log(JSON.stringify(router, null, 2))
const info = router.resolve('GET', '/users');
console.log(123, info);