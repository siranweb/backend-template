import '@/infra/common/global-imports';
import { RouterNode } from 'src/lib/web-server/routing';
import { webServer } from '@/init/web-servers/main';
// import { mainSocketsServer } from '@/init/sockets/main-sockets/sockets-server';

// webServer.start()
//   .then(result => console.log(`Web server (${result.prefix ?? '/'}) is listening on port ${result.port}`));
// mainSocketsServer.start();

const router = new RouterNode();
router.register('GET', '/users/:userId', () => {});
// console.log(JSON.stringify(router, null, 2))
const info = router.get('GET', '/users/kek?test=123&lol=ww');
console.log(info);
